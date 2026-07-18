import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { mkdtemp, rm } from "fs/promises";
import { tmpdir } from "os";
import { join } from "path";
import {
  FactoryEnforcementSmokeResult
} from "./avos-factory-enforcement.contracts";
import {
  AvosFactoryAuditService
} from "./avos-factory-audit.service";
import {
  AvosFactoryEnforcementMetricsService
} from "./avos-factory-enforcement-metrics.service";
import {
  AvosFactoryExecutionEnforcementService
} from "./avos-factory-execution-enforcement.service";
import {
  ProjectGenerationPlan
} from "./project-generator.contracts";

@Injectable()
export class AvosFactoryEnforcementSmokeService {
  constructor(
    private readonly enforcement:
      AvosFactoryExecutionEnforcementService,
    private readonly audit:
      AvosFactoryAuditService,
    private readonly metrics:
      AvosFactoryEnforcementMetricsService
  ) {}

  async run(): Promise<FactoryEnforcementSmokeResult> {
    const root = await mkdtemp(
      join(
        tmpdir(),
        "avos-factory-part-8-"
      )
    );

    const checks: Record<string, boolean> = {
      enforcedExecutionSucceeded: false,
      idempotentReplaySucceeded: false,
      replayReturnedSameTransaction: false,
      auditEventsCreated: false,
      executionMetricsUpdated: false,
      cleanupCompleted: false
    };

    const idempotencyKey =
      `smoke:${randomUUID()}`;

    const plan: ProjectGenerationPlan = {
      id: randomUUID(),
      requestId: randomUUID(),
      name:
        "AVOS Factory Enforcement Smoke",
      projectId:
        `avos.factory.enforcement-smoke.${randomUUID()}`,
      kind:
        "typescript-library",
      status:
        "approved",
      outputPath:
        "enforcement-smoke-project",
      requestedBy:
        "system:part-8-smoke",
      approvedBy:
        "human:khalifa",
      humanApproved:
        true,
      requiresHumanApproval:
        true,
      createdAt:
        new Date().toISOString(),
      variables: {
        enforcement: true
      },
      warnings: [],
      structure: [
        {
          id: "src",
          kind: "directory",
          relativePath: "src"
        },
        {
          id: "source",
          kind: "source",
          relativePath: "src/index.ts",
          content:
            'export const enforced = true;\n',
          dependsOn: ["src"]
        }
      ]
    };

    try {
      const first =
        await this.enforcement.execute({
          idempotencyKey,
          actor:
            "system:part-8-smoke",
          plan,
          options: {
            projectRoot: root,
            humanApproved: true,
            approvedBy:
              "human:khalifa",
            verifyAfterCommit: true
          }
        });

      checks.enforcedExecutionSucceeded =
        first.result.success &&
        first.replayed === false;

      const second =
        await this.enforcement.execute({
          idempotencyKey,
          actor:
            "system:part-8-smoke",
          plan,
          options: {
            projectRoot: root,
            humanApproved: true,
            approvedBy:
              "human:khalifa",
            verifyAfterCommit: true
          }
        });

      checks.idempotentReplaySucceeded =
        second.replayed === true;

      checks.replayReturnedSameTransaction =
        first.result.transactionId ===
        second.result.transactionId;

      checks.auditEventsCreated =
        this.audit.list(100)
          .some((event) =>
            event.resourceId === plan.projectId
          );

      const metrics =
        this.metrics.snapshot();

      checks.executionMetricsUpdated =
        metrics.executionsAttempted >= 2 &&
        metrics.executionsCompleted >= 1 &&
        metrics.executionsReplayed >= 1;

      return {
        success:
          Object.entries(checks)
            .filter(([name]) =>
              name !== "cleanupCompleted"
            )
            .every(([, passed]) => passed),
        checks,
        metrics,
        generatedAt:
          new Date().toISOString()
      };
    } catch (error) {
      return {
        success: false,
        checks,
        metrics:
          this.metrics.snapshot(),
        generatedAt:
          new Date().toISOString(),
        error:
          error instanceof Error
            ? error.message
            : String(error)
      };
    } finally {
      await rm(root, {
        recursive: true,
        force: true
      });

      checks.cleanupCompleted = true;
    }
  }
}
