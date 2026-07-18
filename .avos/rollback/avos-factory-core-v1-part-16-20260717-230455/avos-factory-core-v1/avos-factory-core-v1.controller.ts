import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query
} from "@nestjs/common";
import {
  AvosFactoryCertificationService
} from "./avos-factory-certification.service";
import {
  AvosFactoryRuntimeService
} from "./avos-factory-runtime.service";
import {
  AvosFactoryVerificationService
} from "./avos-factory-verification.service";
import {
  ProjectExecutionInput,
  ProjectRollbackRequest
} from "./project-execution.contracts";
import {
  ProjectExecutionHistoryService
} from "./project-execution-history.service";
import {
  ProjectExecutionService
} from "./project-execution.service";
import {
  ProjectGeneratorRequest
} from "./project-generator.contracts";
import {
  ProjectGeneratorHistoryService
} from "./project-generator-history.service";
import {
  ProjectGeneratorMetricsService
} from "./project-generator-metrics.service";
import {
  ProjectGeneratorService
} from "./project-generator.service";
import {
  ProjectKindRegistryService
} from "./project-kind-registry.service";
import {
  ProjectRollbackEngineService
} from "./project-rollback-engine.service";
import {
  ProjectSmokeTestService
} from "./project-smoke-test.service";

@Controller("avos/factory/v1")
export class AvosFactoryCoreV1Controller {
  constructor(
    private readonly runtime:
      AvosFactoryRuntimeService,
    private readonly projectKinds:
      ProjectKindRegistryService,
    private readonly projectGenerator:
      ProjectGeneratorService,
    private readonly projectExecution:
      ProjectExecutionService,
    private readonly projectRollback:
      ProjectRollbackEngineService,
    private readonly projectHistory:
      ProjectGeneratorHistoryService,
    private readonly executionHistory:
      ProjectExecutionHistoryService,
    private readonly projectMetrics:
      ProjectGeneratorMetricsService,
    private readonly smoke:
      ProjectSmokeTestService,
    private readonly verification:
      AvosFactoryVerificationService,
    private readonly certification:
      AvosFactoryCertificationService
  ) {}

  @Get("status")
  status() {
    return this.runtime.status();
  }

  @Get("project-kinds")
  projectKindsList() {
    return {
      count:
        this.projectKinds.count(),
      items:
        this.projectKinds.list()
    };
  }

  @Post("projects/plan")
  createProjectPlan(
    @Body() request: ProjectGeneratorRequest
  ) {
    return this.projectGenerator.createPlan(
      request
    );
  }

  @Post("projects/execute")
  executeProject(
    @Body() input: ProjectExecutionInput
  ) {
    return this.projectExecution.execute(
      input
    );
  }

  @Post("projects/rollback")
  rollbackProject(
    @Body() request: ProjectRollbackRequest
  ) {
    return this.projectRollback.rollback(
      request
    );
  }

  @Get("history/projects")
  projectGenerationHistory(
    @Query("limit") limit?: string
  ) {
    return {
      items:
        this.projectHistory.list(
          this.parseLimit(limit)
        )
    };
  }

  @Get("history/executions")
  executionHistoryList(
    @Query("limit") limit?: string
  ) {
    return {
      items:
        this.executionHistory.list(
          this.parseLimit(limit)
        )
    };
  }

  @Get("history/executions/project/:projectId")
  executionHistoryByProject(
    @Param("projectId") projectId: string
  ) {
    return {
      projectId,
      items:
        this.executionHistory.listByProject(
          projectId
        )
    };
  }

  @Get("metrics")
  metrics() {
    return this.projectMetrics.snapshot();
  }

  @Post("smoke/run")
  smokeRun() {
    return this.smoke.run();
  }

  @Post("verification/run")
  verificationRun() {
    return this.verification.run();
  }

  @Get("verification/latest")
  verificationLatest() {
    return {
      report:
        this.verification.latest() ?? null
    };
  }

  @Post("certification/certify")
  certificationRun(
    @Body() input: {
      approvedBy: string;
      humanApproved: boolean;
    }
  ) {
    return this.certification.certify(input);
  }

  @Get("certification/latest")
  certificationLatest() {
    return {
      certification:
        this.certification.latest() ?? null
    };
  }

  private parseLimit(value?: string): number {
    const parsed = Number(value);

    if (!Number.isFinite(parsed)) {
      return 100;
    }

    return Math.max(
      1,
      Math.min(
        Math.trunc(parsed),
        1000
      )
    );
  }
}
