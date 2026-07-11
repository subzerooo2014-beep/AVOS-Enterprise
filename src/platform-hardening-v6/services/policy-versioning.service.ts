import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateVersionedPolicyDto } from "../dto/create-versioned-policy.dto";
import { RollbackPolicyDto } from "../dto/rollback-policy.dto";
import { UpdateVersionedPolicyDto } from "../dto/update-versioned-policy.dto";
import { PolicyVersionComparison } from "../interfaces/policy-version-comparison.interface";
import { PolicyVersionPayload } from "../interfaces/policy-version-payload.interface";
import { PersistentAuditLedgerService } from "./persistent-audit-ledger.service";
import { PolicyChecksumService } from "./policy-checksum.service";
import { PolicyVersionRepository } from "./policy-version.repository";

@Injectable()
export class PolicyVersioningService {
  constructor(
    private readonly repository:
      PolicyVersionRepository,
    private readonly checksum:
      PolicyChecksumService,
    private readonly audit:
      PersistentAuditLedgerService,
  ) {}

  async create(
    dto: CreateVersionedPolicyDto,
    context?: {
      correlationId?: string;
      traceId?: string;
      actor?: string;
    },
  ) {
    const existing =
      await this.repository.findPolicy(dto.id);

    if (existing) {
      throw new ConflictException({
        success: false,
        message:
          `Persistent policy ${dto.id} already exists`,
      });
    }

    const payload =
      this.normalizePayload({
        id: dto.id,
        name: dto.name,
        description: dto.description,
        enabled: dto.enabled ?? true,
        methods: dto.methods,
        pathPrefixes: dto.pathPrefixes,
        requireApprovalToken:
          dto.requireApprovalToken,
        blockInProduction:
          dto.blockInProduction,
        severity: dto.severity,
      });

    const checksum =
      this.checksum.create(payload);

    const result =
      await this.repository.transaction(
        async (tx) => {
          const policy =
            await tx.persistentRuntimePolicy.create({
              data: {
                id: payload.id,
                name: payload.name,
                description:
                  payload.description,
                enabled: payload.enabled,
                currentVersion: 1,
              },
            });

          const version =
            await tx.persistentPolicyVersion.create({
              data: {
                policyId: payload.id,
                version: 1,
                name: payload.name,
                description:
                  payload.description,
                enabled: payload.enabled,
                methods: payload.methods,
                pathPrefixes:
                  payload.pathPrefixes,
                requireApprovalToken:
                  payload.requireApprovalToken,
                blockInProduction:
                  payload.blockInProduction,
                severity: payload.severity,
                changeType: "created",
                changeReason:
                  dto.changeReason ??
                  "Initial policy version",
                changedBy:
                  dto.changedBy ??
                  context?.actor ??
                  "platform-owner",
                correlationId:
                  context?.correlationId,
                traceId:
                  context?.traceId,
                checksum,
              },
            });

          const updated =
            await tx.persistentRuntimePolicy.update({
              where: {
                id: payload.id,
              },
              data: {
                currentVersionId:
                  version.id,
              },
              include: {
                currentVersionRecord: true,
              },
            });

          return {
            policy: updated,
            version,
          };
        },
      );

    await this.audit.append({
      eventType:
        "policy_configuration_change",
      severity: "info",
      action:
        "persistent-policy-created",
      message:
        `Persistent runtime policy ${dto.id} version 1 was created`,
      actor:
        dto.changedBy ??
        context?.actor ??
        "platform-owner",
      correlationId:
        context?.correlationId,
      traceId: context?.traceId,
      metadata: {
        policyId: dto.id,
        version: 1,
        checksum,
      },
    });

    return result;
  }

  async update(
    id: string,
    dto: UpdateVersionedPolicyDto,
    context?: {
      correlationId?: string;
      traceId?: string;
      actor?: string;
    },
  ) {
    const existing =
      await this.requirePolicy(id);

    const current =
      existing.currentVersionRecord;

    if (!current) {
      throw new ConflictException({
        success: false,
        message:
          `Policy ${id} does not have a current version`,
      });
    }

    const nextPayload =
      this.normalizePayload({
        id,
        name:
          dto.name ??
          current.name,
        description:
          dto.description ??
          current.description,
        enabled:
          dto.enabled ??
          current.enabled,
        methods:
          dto.methods ??
          this.toStringArray(
            current.methods,
          ),
        pathPrefixes:
          dto.pathPrefixes ??
          this.toStringArray(
            current.pathPrefixes,
          ),
        requireApprovalToken:
          dto.requireApprovalToken ??
          current.requireApprovalToken,
        blockInProduction:
          dto.blockInProduction ??
          current.blockInProduction,
        severity:
          dto.severity ??
          current.severity,
      });

    const nextChecksum =
      this.checksum.create(nextPayload);

    if (
      nextChecksum === current.checksum
    ) {
      throw new ConflictException({
        success: false,
        message:
          "Policy update produced no effective changes",
      });
    }

    const nextVersion =
      existing.currentVersion + 1;

    const result =
      await this.repository.transaction(
        async (tx) => {
          const version =
            await tx.persistentPolicyVersion.create({
              data: {
                policyId: id,
                version: nextVersion,
                name: nextPayload.name,
                description:
                  nextPayload.description,
                enabled:
                  nextPayload.enabled,
                methods:
                  nextPayload.methods,
                pathPrefixes:
                  nextPayload.pathPrefixes,
                requireApprovalToken:
                  nextPayload.requireApprovalToken,
                blockInProduction:
                  nextPayload.blockInProduction,
                severity:
                  nextPayload.severity,
                changeType: "updated",
                changeReason:
                  dto.changeReason,
                changedBy:
                  dto.changedBy ??
                  context?.actor ??
                  "platform-owner",
                correlationId:
                  context?.correlationId,
                traceId:
                  context?.traceId,
                checksum:
                  nextChecksum,
              },
            });

          const policy =
            await tx.persistentRuntimePolicy.update({
              where: { id },
              data: {
                name:
                  nextPayload.name,
                description:
                  nextPayload.description,
                enabled:
                  nextPayload.enabled,
                currentVersion:
                  nextVersion,
                currentVersionId:
                  version.id,
              },
              include: {
                currentVersionRecord: true,
              },
            });

          return {
            policy,
            version,
          };
        },
      );

    await this.audit.append({
      eventType:
        "policy_configuration_change",
      severity: "info",
      action:
        "persistent-policy-updated",
      message:
        `Persistent runtime policy ${id} advanced to version ${nextVersion}`,
      actor:
        dto.changedBy ??
        context?.actor ??
        "platform-owner",
      correlationId:
        context?.correlationId,
      traceId: context?.traceId,
      metadata: {
        policyId: id,
        previousVersion:
          existing.currentVersion,
        currentVersion:
          nextVersion,
        checksum:
          nextChecksum,
        reason:
          dto.changeReason,
      },
    });

    return result;
  }

  async rollback(
    id: string,
    dto: RollbackPolicyDto,
    context?: {
      correlationId?: string;
      traceId?: string;
      actor?: string;
    },
  ) {
    const existing =
      await this.requirePolicy(id);

    const sourceVersion =
      await this.repository.findVersion(
        id,
        dto.version,
      );

    if (!sourceVersion) {
      throw new NotFoundException({
        success: false,
        message:
          `Policy ${id} version ${dto.version} was not found`,
      });
    }

    if (
      dto.version ===
      existing.currentVersion
    ) {
      throw new ConflictException({
        success: false,
        message:
          `Policy ${id} is already on version ${dto.version}`,
      });
    }

    const nextVersion =
      existing.currentVersion + 1;

    const payload =
      this.normalizePayload({
        id,
        name:
          sourceVersion.name,
        description:
          sourceVersion.description,
        enabled:
          sourceVersion.enabled,
        methods:
          this.toStringArray(
            sourceVersion.methods,
          ),
        pathPrefixes:
          this.toStringArray(
            sourceVersion.pathPrefixes,
          ),
        requireApprovalToken:
          sourceVersion.requireApprovalToken,
        blockInProduction:
          sourceVersion.blockInProduction,
        severity:
          sourceVersion.severity,
      });

    const checksum =
      this.checksum.create(payload);

    const result =
      await this.repository.transaction(
        async (tx) => {
          const version =
            await tx.persistentPolicyVersion.create({
              data: {
                policyId: id,
                version: nextVersion,
                name: payload.name,
                description:
                  payload.description,
                enabled:
                  payload.enabled,
                methods:
                  payload.methods,
                pathPrefixes:
                  payload.pathPrefixes,
                requireApprovalToken:
                  payload.requireApprovalToken,
                blockInProduction:
                  payload.blockInProduction,
                severity:
                  payload.severity,
                changeType: "rollback",
                changeReason:
                  dto.reason,
                changedBy:
                  dto.changedBy ??
                  context?.actor ??
                  "platform-owner",
                correlationId:
                  context?.correlationId,
                traceId:
                  context?.traceId,
                restoredFromVersion:
                  dto.version,
                checksum,
              },
            });

          const policy =
            await tx.persistentRuntimePolicy.update({
              where: { id },
              data: {
                name: payload.name,
                description:
                  payload.description,
                enabled:
                  payload.enabled,
                currentVersion:
                  nextVersion,
                currentVersionId:
                  version.id,
              },
              include: {
                currentVersionRecord: true,
              },
            });

          return {
            policy,
            version,
            restoredFromVersion:
              dto.version,
          };
        },
      );

    await this.audit.append({
      eventType:
        "policy_configuration_change",
      severity: "warning",
      action:
        "persistent-policy-rolled-back",
      message:
        `Persistent runtime policy ${id} was restored from version ${dto.version} as version ${nextVersion}`,
      actor:
        dto.changedBy ??
        context?.actor ??
        "platform-owner",
      correlationId:
        context?.correlationId,
      traceId: context?.traceId,
      metadata: {
        policyId: id,
        restoredFromVersion:
          dto.version,
        newVersion:
          nextVersion,
        reason:
          dto.reason,
        checksum,
      },
    });

    return result;
  }

  async compare(
    id: string,
    fromVersion: number,
    toVersion: number,
  ): Promise<PolicyVersionComparison> {
    const [from, to] =
      await Promise.all([
        this.repository.findVersion(
          id,
          fromVersion,
        ),
        this.repository.findVersion(
          id,
          toVersion,
        ),
      ]);

    if (!from || !to) {
      throw new NotFoundException({
        success: false,
        message:
          `One or both policy versions were not found`,
        policyId: id,
        fromVersion,
        toVersion,
      });
    }

    const fields = [
      "name",
      "description",
      "enabled",
      "methods",
      "pathPrefixes",
      "requireApprovalToken",
      "blockInProduction",
      "severity",
      "checksum",
    ];

    const differences =
      fields.map((field) => {
        const before =
          this.normalizeComparable(
            (from as any)[field],
          );

        const after =
          this.normalizeComparable(
            (to as any)[field],
          );

        return {
          field,
          before,
          after,
          changed:
            JSON.stringify(before) !==
            JSON.stringify(after),
        };
      });

    return {
      policyId: id,
      fromVersion,
      toVersion,
      changed:
        differences.some(
          (item) => item.changed,
        ),
      differences,
      comparedAt:
        new Date().toISOString(),
    };
  }

  findAll() {
    return this.repository.findPolicies();
  }

  async findOne(id: string) {
    return this.requirePolicy(id);
  }

  history(
    id: string,
    limit = 100,
  ) {
    return this.repository.findVersions(
      id,
      Math.min(
        Math.max(limit, 1),
        1000,
      ),
    );
  }

  async getSummary() {
    const [
      policies,
      versions,
      items,
    ] = await Promise.all([
      this.repository.countPolicies(),
      this.repository.countVersions(),
      this.repository.findPolicies(),
    ]);

    return {
      totalPolicies: policies,
      totalVersions: versions,
      enabledPolicies:
        items.filter(
          (item: any) =>
            item.enabled,
        ).length,
      disabledPolicies:
        items.filter(
          (item: any) =>
            !item.enabled,
        ).length,
      averageVersionsPerPolicy:
        policies > 0
          ? Number(
              (
                versions / policies
              ).toFixed(2),
            )
          : 0,
    };
  }

  private async requirePolicy(
    id: string,
  ) {
    const policy =
      await this.repository.findPolicy(id);

    if (!policy) {
      throw new NotFoundException({
        success: false,
        message:
          `Persistent policy ${id} was not found`,
      });
    }

    return policy;
  }

  private normalizePayload(
    payload: PolicyVersionPayload,
  ): PolicyVersionPayload {
    return {
      ...payload,
      name: payload.name.trim(),
      description:
        payload.description.trim(),
      methods:
        Array.from(
          new Set(
            payload.methods.map(
              (item) =>
                item.trim().toUpperCase(),
            ),
          ),
        ),
      pathPrefixes:
        Array.from(
          new Set(
            payload.pathPrefixes.map(
              (item) =>
                item.trim(),
            ),
          ),
        ),
      severity:
        payload.severity.toLowerCase(),
    };
  }

  private toStringArray(
    value: unknown,
  ): string[] {
    if (!Array.isArray(value)) {
      return [];
    }

    return value.map(String);
  }

  private normalizeComparable(
    value: unknown,
  ): unknown {
    if (Array.isArray(value)) {
      return [...value]
        .map(String)
        .sort();
    }

    return value;
  }
}
