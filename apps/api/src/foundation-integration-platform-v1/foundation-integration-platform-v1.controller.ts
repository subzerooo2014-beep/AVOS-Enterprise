import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { FoundationAiIntegrationV1Service } from "./foundation-ai-integration-v1.service";
import { FoundationBootstrapOrchestratorV1Service } from "./foundation-bootstrap-orchestrator-v1.service";
import { FoundationExecutionIntegrationV1Service } from "./foundation-execution-integration-v1.service";
import { FoundationHealthAggregationV1Service } from "./foundation-health-aggregation-v1.service";
import { FoundationIntegrationPlatformV1Service } from "./foundation-integration-platform-v1.service";
import { FoundationRuntimeDependencyResolverV1Service } from "./foundation-runtime-dependency-resolver-v1.service";
import { FoundationUnifiedCapabilityRegistryV1Service } from "./foundation-unified-capability-registry-v1.service";
import { FoundationUnifiedModuleRegistryV1Service } from "./foundation-unified-module-registry-v1.service";
import type {
  FoundationIntegrationCapabilityV1,
  FoundationIntegrationModuleV1,
} from "./foundation-integration-platform-v1.types";

@Controller("foundation-integration-platform-v1")
export class FoundationIntegrationPlatformV1Controller {
  constructor(
    private readonly platform: FoundationIntegrationPlatformV1Service,
    private readonly modules: FoundationUnifiedModuleRegistryV1Service,
    private readonly capabilities: FoundationUnifiedCapabilityRegistryV1Service,
    private readonly dependencies: FoundationRuntimeDependencyResolverV1Service,
    private readonly bootstrap: FoundationBootstrapOrchestratorV1Service,
    private readonly executions: FoundationExecutionIntegrationV1Service,
    private readonly ai: FoundationAiIntegrationV1Service,
    private readonly health: FoundationHealthAggregationV1Service,
  ) {}

  @Get("status")
  status() {
    return this.platform.status();
  }

  @Get("diagnostics")
  diagnostics() {
    return this.platform.diagnostics();
  }

  @Post("modules")
  upsertModule(
    @Body()
    body: Omit<FoundationIntegrationModuleV1, "createdAt" | "updatedAt">,
  ) {
    return {
      success: true,
      module: this.modules.upsert(body),
    };
  }

  @Post("capabilities")
  upsertCapability(
    @Body()
    body: Omit<FoundationIntegrationCapabilityV1, "updatedAt">,
  ) {
    return {
      success: true,
      capability: this.capabilities.upsert(body),
    };
  }

  @Get("dependencies/:moduleId")
  resolveDependencies(@Param("moduleId") moduleId: string) {
    return {
      success: true,
      result: this.dependencies.resolve(moduleId),
    };
  }

  @Post("bootstrap/steps")
  registerBootstrapStep(
    @Body()
    body: {
      id: string;
      name: string;
      order: number;
      dependencies?: string[];
    },
  ) {
    return {
      success: true,
      step: this.bootstrap.register(
        body.id,
        body.name,
        body.order,
        body.dependencies,
      ),
    };
  }

  @Post("bootstrap/run-all")
  runBootstrap() {
    return {
      success: true,
      steps: this.bootstrap.runAll(),
    };
  }

  @Post("executions")
  createExecution(
    @Body()
    body: {
      workflow: string;
      rules: string[];
      policy: string;
      context: Record<string, unknown>;
      aiTask?: string;
    },
  ) {
    return {
      success: true,
      request: this.executions.create(
        body.workflow,
        body.rules,
        body.policy,
        body.context,
        body.aiTask,
      ),
    };
  }

  @Post("executions/:id/run")
  runExecution(@Param("id") id: string) {
    return {
      success: true,
      request: this.executions.execute(id),
    };
  }

  @Post("ai/execute")
  executeAi(
    @Body()
    body: {
      task: string;
      context: Record<string, unknown>;
    },
  ) {
    return {
      success: true,
      result: this.ai.execute(body.task, body.context),
    };
  }

  @Post("health")
  reportHealth(
    @Body()
    body: {
      id: string;
      name: string;
      score: number;
      details?: string[];
    },
  ) {
    return {
      success: true,
      component: this.health.report(
        body.id,
        body.name,
        body.score,
        body.details,
      ),
    };
  }
}
