import {
  Body,
  Controller,
  Get,
  Param,
  Post
} from "@nestjs/common";
import { EnterpriseKernelMegaPack4Service } from "./enterprise-kernel-mega-pack-4.service";
import { KernelHealthRegistryService } from "./registry/kernel-health-registry.service";
import { KernelFailureClassifierService } from "./failures/kernel-failure-classifier.service";
import { KernelDiagnosticsService } from "./diagnostics/kernel-diagnostics.service";
import { KernelIsolationService } from "./isolation/kernel-isolation.service";
import { KernelRecoveryService } from "./recovery/kernel-recovery.service";
import { KernelRestartPolicyService } from "./restart/kernel-restart-policy.service";
import { KernelOperationalModeService } from "./modes/kernel-operational-mode.service";
import { KernelDiagnosticSnapshotService } from "./snapshots/kernel-diagnostic-snapshot.service";
import { KernelRecoveryReadinessService } from "./readiness/kernel-recovery-readiness.service";
import { KernelResilienceHealthService } from "./health/kernel-resilience-health.service";
import { KernelResilienceAuditService } from "./observability/kernel-resilience-audit.service";
import {
  KernelOperationalMode,
  KernelRestartPolicy
} from "./enterprise-kernel-mega-pack-4.types";

@Controller("enterprise-kernel-v4")
export class EnterpriseKernelMegaPack4Controller {
  constructor(
    private readonly pack: EnterpriseKernelMegaPack4Service,
    private readonly healthRegistry: KernelHealthRegistryService,
    private readonly failures: KernelFailureClassifierService,
    private readonly diagnostics: KernelDiagnosticsService,
    private readonly isolation: KernelIsolationService,
    private readonly recovery: KernelRecoveryService,
    private readonly restart: KernelRestartPolicyService,
    private readonly modes: KernelOperationalModeService,
    private readonly snapshots: KernelDiagnosticSnapshotService,
    private readonly readiness: KernelRecoveryReadinessService,
    private readonly health: KernelResilienceHealthService,
    private readonly audit: KernelResilienceAuditService
  ) {}

  @Get("status")
  status() {
    return this.pack.status();
  }

  @Get("verification")
  verification() {
    return this.pack.verification();
  }

  @Get("health/components")
  componentHealth() {
    return {
      summary: this.healthRegistry.summary(),
      items: this.healthRegistry.listRecords()
    };
  }

  @Post("health/components")
  registerHealthComponent(
    @Body()
    body: {
      componentId: string;
      componentName: string;
      metadata?: Record<string, unknown>;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.healthRegistry.registerComponent(body);
  }

  @Post("health/signals")
  ingestHealthSignal(
    @Body()
    body: {
      componentId: string;
      status:
        | "unknown"
        | "healthy"
        | "degraded"
        | "unhealthy"
        | "critical"
        | "isolated"
        | "recovering";
      score: number;
      source: string;
      message: string;
      metrics?: Record<string, number>;
      metadata?: Record<string, unknown>;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.healthRegistry.ingestSignal(body);
  }

  @Post("failures/classify")
  classifyFailure(
    @Body()
    body: {
      componentId: string;
      code: string;
      message: string;
      context?: Record<string, unknown>;
      correlationId: string;
      actorIdentityId: string;
    }
  ) {
    return this.failures.classify(body);
  }

  @Get("failures")
  failureList() {
    return {
      summary: this.failures.summary(),
      items: this.failures.list()
    };
  }

  @Post("diagnostics/:componentId")
  diagnoseComponent(
    @Param("componentId") componentId: string,
    @Body()
    body: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.diagnostics.diagnose({
      componentId,
      ...body
    });
  }

  @Post("diagnostics/run-all")
  diagnoseAll(
    @Body()
    body: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.diagnostics.diagnoseAll(body);
  }

  @Get("diagnostics")
  diagnosticList() {
    return {
      summary: this.diagnostics.summary(),
      items: this.diagnostics.list()
    };
  }

  @Post("isolation")
  isolate(
    @Body()
    body: {
      componentId: string;
      reason: string;
      isolatedByIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.isolation.isolate(body);
  }

  @Post("isolation/:id/release")
  releaseIsolation(
    @Param("id") id: string,
    @Body()
    body: {
      releasedByIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.isolation.release({
      isolationId: id,
      ...body
    });
  }

  @Get("isolation")
  isolationList() {
    return {
      summary: this.isolation.summary(),
      items: this.isolation.list()
    };
  }

  @Post("recovery/plans")
  createRecoveryPlan(
    @Body()
    body: {
      failureId: string;
      createdByIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.recovery.create(body);
  }

  @Post("recovery/plans/:id/approve")
  approveRecoveryPlan(
    @Param("id") id: string,
    @Body()
    body: {
      approvedByIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.recovery.approve({
      planId: id,
      ...body
    });
  }

  @Post("recovery/plans/:id/execute")
  executeRecoveryPlan(
    @Param("id") id: string,
    @Body()
    body: {
      actorIdentityId: string;
      correlationId: string;
      humanApprovedSafeMode?: boolean;
    }
  ) {
    return this.recovery.execute({
      planId: id,
      ...body
    });
  }

  @Get("recovery/plans")
  recoveryPlanList() {
    return {
      summary: this.recovery.summary(),
      items: this.recovery.list()
    };
  }

  @Get("restart/policies")
  restartPolicies() {
    return {
      summary: this.restart.summary(),
      items: this.restart.listPolicies()
    };
  }

  @Post("restart/policies")
  registerRestartPolicy(
    @Body()
    body: {
      policy: Omit<KernelRestartPolicy, "createdAt" | "updatedAt">;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.restart.register(
      body.policy,
      {
        actorIdentityId: body.actorIdentityId,
        correlationId: body.correlationId
      }
    );
  }

  @Post("restart/policies/:id/attempt")
  restartAttempt(
    @Param("id") id: string,
    @Body()
    body: {
      actorIdentityId: string;
      correlationId: string;
      reason: string;
      simulateSuccess?: boolean;
      humanApprovedSafeMode?: boolean;
    }
  ) {
    return this.restart.attempt({
      policyId: id,
      ...body
    });
  }

  @Get("modes")
  currentMode() {
    return {
      current: this.modes.current(),
      summary: this.modes.summary(),
      transitions: this.modes.listTransitions()
    };
  }

  @Post("modes/transition")
  transitionMode(
    @Body()
    body: {
      toMode: KernelOperationalMode;
      reason: string;
      actorIdentityId: string;
      correlationId: string;
      humanApproved: boolean;
    }
  ) {
    return this.modes.transition(body);
  }

  @Post("snapshots")
  createSnapshot(
    @Body()
    body: {
      createdByIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.snapshots.create(body);
  }

  @Get("snapshots")
  snapshotList() {
    return {
      summary: this.snapshots.summary(),
      items: this.snapshots.list()
    };
  }

  @Post("readiness/assess")
  assessReadiness(
    @Body()
    body: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.readiness.assess(body);
  }

  @Get("readiness")
  readinessList() {
    return {
      summary: this.readiness.summary(),
      items: this.readiness.list()
    };
  }

  @Post("health/calculate")
  calculateHealth(
    @Body()
    body: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.health.calculate(body);
  }

  @Get("health")
  healthList() {
    return {
      summary: this.health.summary(),
      items: this.health.list()
    };
  }

  @Get("audit")
  auditList() {
    return {
      summary: this.audit.summary(),
      items: this.audit.list()
    };
  }
}
