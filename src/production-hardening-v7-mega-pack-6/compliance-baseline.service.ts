import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  BASELINE_CODE_PREFIX,
  MEGA_PACK_6_COLLECTIONS,
} from "./constants/mega-pack-6.constants";
import { CompareBaselineDto } from "./dto/compare-baseline.dto";
import { CreateComplianceBaselineDto } from "./dto/create-compliance-baseline.dto";
import { EnterpriseFingerprintService } from "./enterprise-fingerprint.service";
import { EnterpriseSequenceService } from "./enterprise-sequence.service";
import { MegaPack6StorageService } from "./mega-pack-6-storage.service";
import { ObjectPathService } from "./object-path.service";
import { PlatformEventBusService } from "./platform-event-bus.service";
import {
  BaselineComparison,
  BaselineControl,
  BaselineControlResult,
  BaselineStatus,
  ComplianceBaseline,
} from "./types/mega-pack-6.types";

@Injectable()
export class ComplianceBaselineService {
  constructor(
    private readonly storage: MegaPack6StorageService,
    private readonly sequence: EnterpriseSequenceService,
    private readonly fingerprint: EnterpriseFingerprintService,
    private readonly objectPath: ObjectPathService,
    private readonly events: PlatformEventBusService,
  ) {}

  async create(
    dto: CreateComplianceBaselineDto,
  ): Promise<ComplianceBaseline> {
    const baselines =
      await this.storage.readCollection<ComplianceBaseline>(
        MEGA_PACK_6_COLLECTIONS.complianceBaselines,
      );

    const duplicate = baselines.find(
      (baseline) =>
        baseline.baselineCode === dto.baselineCode &&
        baseline.version === (dto.version ?? 1),
    );

    if (duplicate) {
      throw new BadRequestException(
        `Baseline ${dto.baselineCode} version ${dto.version ?? 1} already exists`,
      );
    }

    const now = new Date().toISOString();

    const controls: BaselineControl[] =
      dto.controls.map((control) => ({
        id: randomUUID(),
        controlCode: control.controlCode,
        name: control.name,
        description: control.description,
        severity: control.severity,
        comparisonType: control.comparisonType,
        expectedValue: control.expectedValue,
        resourcePath: control.resourcePath,
        enabled: control.enabled ?? true,
        metadata: control.metadata ?? {},
      }));

    const baseline: ComplianceBaseline = {
      id: randomUUID(),
      baselineCode:
        dto.baselineCode ||
        this.sequence.next(BASELINE_CODE_PREFIX),
      name: dto.name,
      description: dto.description,
      domain: dto.domain,
      version: dto.version ?? 1,
      status: "draft",
      owner: dto.owner,
      effectiveFrom: dto.effectiveFrom,
      effectiveUntil: dto.effectiveUntil,
      supersedesBaselineId:
        dto.supersedesBaselineId,
      controls,
      metadata: dto.metadata ?? {},
      createdAt: now,
      updatedAt: now,
    };

    baselines.push(baseline);

    await this.storage.writeCollection(
      MEGA_PACK_6_COLLECTIONS.complianceBaselines,
      baselines,
    );

    await this.events.publish({
      eventType: "compliance.baseline.created",
      source: "ComplianceBaselineService",
      severity: "low",
      entityType: "compliance_baseline",
      entityId: baseline.id,
      payload: {
        baselineCode: baseline.baselineCode,
        version: baseline.version,
        domain: baseline.domain,
      },
    });

    return baseline;
  }

  async list(
    status?: BaselineStatus,
  ): Promise<ComplianceBaseline[]> {
    const baselines =
      await this.storage.readCollection<ComplianceBaseline>(
        MEGA_PACK_6_COLLECTIONS.complianceBaselines,
      );

    return baselines
      .filter(
        (baseline) =>
          !status || baseline.status === status,
      )
      .sort(
        (a, b) =>
          a.baselineCode.localeCompare(
            b.baselineCode,
          ) || b.version - a.version,
      );
  }

  async get(
    id: string,
  ): Promise<ComplianceBaseline> {
    const baseline =
      await this.storage.findById<ComplianceBaseline>(
        MEGA_PACK_6_COLLECTIONS.complianceBaselines,
        id,
      );

    if (!baseline) {
      throw new NotFoundException(
        `Compliance baseline ${id} was not found`,
      );
    }

    return baseline;
  }

  async updateStatus(
    id: string,
    status: BaselineStatus,
    actor = "system",
  ): Promise<ComplianceBaseline> {
    const baseline = await this.get(id);

    this.validateStatusTransition(
      baseline.status,
      status,
    );

    const now = new Date().toISOString();

    const updated: ComplianceBaseline = {
      ...baseline,
      status,
      approvedBy:
        status === "approved"
          ? actor
          : baseline.approvedBy,
      approvedAt:
        status === "approved"
          ? now
          : baseline.approvedAt,
      effectiveFrom:
        status === "active"
          ? baseline.effectiveFrom ?? now
          : baseline.effectiveFrom,
      updatedAt: now,
    };

    await this.storage.replaceById(
      MEGA_PACK_6_COLLECTIONS.complianceBaselines,
      id,
      updated,
    );

    if (
      status === "active" &&
      baseline.supersedesBaselineId
    ) {
      await this.supersedePrevious(
        baseline.supersedesBaselineId,
      );
    }

    await this.events.publish({
      eventType: "compliance.baseline.status_changed",
      source: "ComplianceBaselineService",
      severity:
        status === "active" ? "medium" : "low",
      entityType: "compliance_baseline",
      entityId: id,
      payload: {
        previousStatus: baseline.status,
        currentStatus: status,
        actor,
      },
    });

    return updated;
  }

  async compare(
    baselineId: string,
    dto: CompareBaselineDto,
  ): Promise<BaselineComparison> {
    const baseline = await this.get(baselineId);

    if (
      !["approved", "active"].includes(
        baseline.status,
      )
    ) {
      throw new BadRequestException(
        "Only approved or active baselines can be compared",
      );
    }

    const startedAt = new Date();

    const results: BaselineControlResult[] =
      baseline.controls
        .filter((control) => control.enabled)
        .map((control) =>
          this.evaluateControl(
            control,
            dto.observedState,
          ),
        );

    const failed = results.filter(
      (result) =>
        result.status === "failed" ||
        result.status === "error",
    );

    const passed = results.filter(
      (result) => result.status === "passed",
    );

    const score =
      results.length === 0
        ? 100
        : Math.round(
            (passed.length / results.length) *
              100,
          );

    const completedAt =
      new Date().toISOString();

    const comparison: BaselineComparison = {
      id: randomUUID(),
      baselineId: baseline.id,
      baselineCode: baseline.baselineCode,
      baselineVersion: baseline.version,
      targetType: dto.targetType,
      targetId: dto.targetId,
      status:
        failed.length === 0
          ? "compliant"
          : "drift_detected",
      score,
      startedAt: startedAt.toISOString(),
      completedAt,
      results,
      fingerprint: this.fingerprint.create({
        baselineId,
        baselineVersion: baseline.version,
        targetType: dto.targetType,
        targetId: dto.targetId,
        observedState: dto.observedState,
        results,
      }),
      createdAt: completedAt,
      updatedAt: completedAt,
    };

    await this.storage.append(
      MEGA_PACK_6_COLLECTIONS.baselineComparisons,
      comparison,
    );

    await this.events.publish({
      eventType:
        comparison.status === "compliant"
          ? "compliance.baseline.compliant"
          : "compliance.baseline.drift_detected",
      source: "ComplianceBaselineService",
      severity:
        comparison.status === "compliant"
          ? "informational"
          : this.resolveDriftSeverity(results),
      entityType: "baseline_comparison",
      entityId: comparison.id,
      payload: {
        baselineId,
        targetType: dto.targetType,
        targetId: dto.targetId,
        score,
        failedControls: failed.length,
      },
    });

    return comparison;
  }

  async listComparisons(
    baselineId?: string,
  ): Promise<BaselineComparison[]> {
    const comparisons =
      await this.storage.readCollection<BaselineComparison>(
        MEGA_PACK_6_COLLECTIONS.baselineComparisons,
      );

    return comparisons
      .filter(
        (comparison) =>
          !baselineId ||
          comparison.baselineId === baselineId,
      )
      .sort((a, b) =>
        b.createdAt.localeCompare(a.createdAt),
      );
  }

  async seedDefaults(): Promise<{
    created: number;
    total: number;
  }> {
    const existing = await this.list();

    if (
      existing.some(
        (baseline) =>
          baseline.baselineCode ===
          "AVOS-BASELINE-SECURITY-001",
      )
    ) {
      return {
        created: 0,
        total: existing.length,
      };
    }

    await this.create({
      baselineCode:
        "AVOS-BASELINE-SECURITY-001",
      name:
        "AVOS Enterprise Security Baseline",
      description:
        "Canonical security baseline for core AVOS production controls.",
      domain: "enterprise-security",
      owner: "AVOS Security Governance",
      version: 1,
      controls: [
        {
          controlCode: "AVOS-BSL-001",
          name: "Audit ledger enabled",
          description:
            "Persistent audit ledger must remain enabled.",
          severity: "critical",
          comparisonType: "equals",
          expectedValue: true,
          resourcePath:
            "capabilities.persistentAuditLedger",
        },
        {
          controlCode: "AVOS-BSL-002",
          name: "Digital signatures enabled",
          description:
            "Digital signature verification must remain enabled.",
          severity: "critical",
          comparisonType: "equals",
          expectedValue: true,
          resourcePath:
            "capabilities.digitalSignatures",
        },
        {
          controlCode: "AVOS-BSL-003",
          name: "Integrity scanning enabled",
          description:
            "Integrity scanning must remain enabled.",
          severity: "high",
          comparisonType: "equals",
          expectedValue: true,
          resourcePath:
            "capabilities.integrityScanner",
        },
        {
          controlCode: "AVOS-BSL-004",
          name: "Compliance snapshot available",
          description:
            "At least one compliance snapshot must be available.",
          severity: "high",
          comparisonType: "greater_than",
          expectedValue: 0,
          resourcePath:
            "metrics.complianceSnapshots",
        },
      ],
      metadata: {
        seeded: true,
      },
    });

    const created =
      await this.list();

    const baseline = created.find(
      (item) =>
        item.baselineCode ===
        "AVOS-BASELINE-SECURITY-001",
    );

    if (baseline) {
      await this.updateStatus(
        baseline.id,
        "pending_approval",
        "system",
      );

      await this.updateStatus(
        baseline.id,
        "approved",
        "AVOS Security Governance",
      );

      await this.updateStatus(
        baseline.id,
        "active",
        "AVOS Security Governance",
      );
    }

    return {
      created: 1,
      total: created.length,
    };
  }

  private evaluateControl(
    control: BaselineControl,
    observedState: Record<string, unknown>,
  ): BaselineControlResult {
    try {
      const observedValue =
        this.objectPath.get(
          observedState,
          control.resourcePath,
        );

      const exists =
        observedValue !== undefined;

      let passed = false;

      switch (control.comparisonType) {
        case "equals":
          passed =
            this.fingerprint.create(
              observedValue,
            ) ===
            this.fingerprint.create(
              control.expectedValue,
            );
          break;

        case "not_equals":
          passed =
            this.fingerprint.create(
              observedValue,
            ) !==
            this.fingerprint.create(
              control.expectedValue,
            );
          break;

        case "contains":
          passed =
            typeof observedValue === "string"
              ? observedValue.includes(
                  String(
                    control.expectedValue,
                  ),
                )
              : Array.isArray(observedValue)
                ? observedValue.some(
                    (item) =>
                      this.fingerprint.create(
                        item,
                      ) ===
                      this.fingerprint.create(
                        control.expectedValue,
                      ),
                  )
                : false;
          break;

        case "exists":
          passed = exists;
          break;

        case "not_exists":
          passed = !exists;
          break;

        case "greater_than":
          passed =
            Number(observedValue) >
            Number(control.expectedValue);
          break;

        case "less_than":
          passed =
            Number(observedValue) <
            Number(control.expectedValue);
          break;

        case "custom":
          return {
            controlId: control.id,
            controlCode: control.controlCode,
            status: "warning",
            severity: control.severity,
            expectedValue:
              control.expectedValue,
            observedValue,
            message:
              "Custom comparison requires an external handler",
          };
      }

      return {
        controlId: control.id,
        controlCode: control.controlCode,
        status: passed ? "passed" : "failed",
        severity: control.severity,
        expectedValue: control.expectedValue,
        observedValue,
        message: passed
          ? "Control matched the approved baseline"
          : "Observed value differs from the approved baseline",
      };
    } catch (error) {
      return {
        controlId: control.id,
        controlCode: control.controlCode,
        status: "error",
        severity: control.severity,
        expectedValue: control.expectedValue,
        message:
          error instanceof Error
            ? error.message
            : "Unknown comparison error",
      };
    }
  }

  private validateStatusTransition(
    current: BaselineStatus,
    target: BaselineStatus,
  ): void {
    const transitions:
      Record<BaselineStatus, BaselineStatus[]> = {
        draft: [
          "pending_approval",
          "retired",
        ],
        pending_approval: [
          "approved",
          "draft",
          "retired",
        ],
        approved: [
          "active",
          "retired",
        ],
        active: [
          "superseded",
          "retired",
        ],
        superseded: ["retired"],
        retired: [],
      };

    if (
      current !== target &&
      !transitions[current].includes(target)
    ) {
      throw new BadRequestException(
        `Invalid baseline transition from ${current} to ${target}`,
      );
    }
  }

  private async supersedePrevious(
    id: string,
  ): Promise<void> {
    const previous =
      await this.storage.findById<ComplianceBaseline>(
        MEGA_PACK_6_COLLECTIONS.complianceBaselines,
        id,
      );

    if (!previous) {
      return;
    }

    await this.storage.replaceById(
      MEGA_PACK_6_COLLECTIONS.complianceBaselines,
      id,
      {
        ...previous,
        status: "superseded",
        updatedAt: new Date().toISOString(),
      },
    );
  }

  private resolveDriftSeverity(
    results: BaselineControlResult[],
  ):
    | "informational"
    | "low"
    | "medium"
    | "high"
    | "critical" {
    const failed = results.filter(
      (result) =>
        result.status === "failed" ||
        result.status === "error",
    );

    if (
      failed.some(
        (result) =>
          result.severity === "critical",
      )
    ) {
      return "critical";
    }

    if (
      failed.some(
        (result) =>
          result.severity === "high",
      )
    ) {
      return "high";
    }

    if (
      failed.some(
        (result) =>
          result.severity === "medium",
      )
    ) {
      return "medium";
    }

    return failed.length > 0
      ? "low"
      : "informational";
  }
}
