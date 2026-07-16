import {
  Body,
  Controller,
  Get,
  Param,
  Post
} from "@nestjs/common";
import { EnterpriseKernelMegaPack1Service } from "./enterprise-kernel-mega-pack-1.service";
import { KernelIdentityService } from "./identity/kernel-identity.service";
import { KernelContextService } from "./context/kernel-context.service";
import { KernelStateService } from "./state/kernel-state.service";
import { KernelModuleRegistryService } from "./modules/kernel-module-registry.service";
import { KernelLifecycleService } from "./lifecycle/kernel-lifecycle.service";
import { KernelStartupPipelineService } from "./pipelines/kernel-startup-pipeline.service";
import { KernelShutdownPipelineService } from "./pipelines/kernel-shutdown-pipeline.service";
import { KernelReadinessService } from "./readiness/kernel-readiness.service";
import { KernelHealthService } from "./health/kernel-health.service";
import { KernelAuditService } from "./observability/kernel-audit.service";
import {
  KernelLifecycleAction,
  KernelModuleManifest,
  KernelRuntimeStatus
} from "./enterprise-kernel-mega-pack-1.types";

@Controller("enterprise-kernel-v1")
export class EnterpriseKernelMegaPack1Controller {
  constructor(
    private readonly pack: EnterpriseKernelMegaPack1Service,
    private readonly identity: KernelIdentityService,
    private readonly contexts: KernelContextService,
    private readonly state: KernelStateService,
    private readonly modules: KernelModuleRegistryService,
    private readonly lifecycle: KernelLifecycleService,
    private readonly startup: KernelStartupPipelineService,
    private readonly shutdown: KernelShutdownPipelineService,
    private readonly readiness: KernelReadinessService,
    private readonly health: KernelHealthService,
    private readonly audit: KernelAuditService
  ) {}

  @Get("status")
  status() {
    return this.pack.status();
  }

  @Get("verification")
  verification() {
    return this.pack.verification();
  }

  @Get("identity")
  kernelIdentity() {
    return this.identity.get();
  }

  @Get("runtime/state")
  runtimeState() {
    return this.state.get();
  }

  @Post("runtime/state")
  transitionRuntime(
    @Body()
    body: {
      status: KernelRuntimeStatus;
      actorIdentityId: string;
      correlationId: string;
      metadata?: Record<string, unknown>;
    }
  ) {
    return this.state.transition(body);
  }

  @Get("contexts")
  contextList() {
    return {
      summary: this.contexts.summary(),
      items: this.contexts.list()
    };
  }

  @Post("contexts")
  createContext(
    @Body()
    body: {
      environment?: string;
      region?: string;
      nodeName?: string;
      startedByIdentityId: string;
      correlationId: string;
      metadata?: Record<string, unknown>;
    }
  ) {
    return this.contexts.create(body);
  }

  @Post("startup")
  startKernel(
    @Body()
    body: {
      actorIdentityId: string;
      correlationId: string;
      environment?: string;
      region?: string;
      nodeName?: string;
    }
  ) {
    return this.startup.execute(body);
  }

  @Post("shutdown")
  shutdownKernel(
    @Body()
    body: {
      actorIdentityId: string;
      correlationId: string;
      reason?: string;
    }
  ) {
    return this.shutdown.execute(body);
  }

  @Get("modules")
  moduleList() {
    return {
      summary: this.modules.summary(),
      items: this.modules.list()
    };
  }

  @Get("modules/:id")
  moduleById(@Param("id") id: string) {
    return this.modules.get(id);
  }

  @Post("modules")
  registerModule(
    @Body()
    body: {
      manifest: KernelModuleManifest;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.modules.register(
      body.manifest,
      {
        actorIdentityId: body.actorIdentityId,
        correlationId: body.correlationId
      }
    );
  }

  @Post("modules/:id/lifecycle")
  executeLifecycle(
    @Param("id") id: string,
    @Body()
    body: {
      action: KernelLifecycleAction;
      actorIdentityId: string;
      correlationId: string;
      reason?: string;
      details?: Record<string, unknown>;
    }
  ) {
    return this.lifecycle.execute({
      moduleId: id,
      ...body
    });
  }

  @Post("modules/:id/bootstrap")
  bootstrapModule(
    @Param("id") id: string,
    @Body()
    body: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.lifecycle.bootstrapModule({
      moduleId: id,
      ...body
    });
  }

  @Get("modules/:id/history")
  lifecycleHistory(@Param("id") id: string) {
    return {
      moduleId: id,
      items: this.lifecycle.history(id)
    };
  }

  @Get("lifecycle/transitions")
  lifecycleTransitions() {
    return {
      summary: this.lifecycle.summary(),
      items: this.lifecycle.listTransitions()
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
