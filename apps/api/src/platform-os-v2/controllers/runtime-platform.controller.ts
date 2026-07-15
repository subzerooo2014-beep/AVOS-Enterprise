import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PlatformOperationDto } from '../dto/platform-operation.dto';
import { EnterpriseRuntimeV2Service } from '../services/enterprise-runtime-v2.service';
import { ModuleRuntimeService } from '../services/module-runtime.service';
import { DynamicModuleLoaderService } from '../services/dynamic-module-loader.service';
import { RuntimeRegistryService } from '../services/runtime-registry.service';
import { RuntimeHealthEngineService } from '../services/runtime-health-engine.service';
import { RuntimeDiagnosticsService } from '../services/runtime-diagnostics.service';
import { RuntimeLifecycleService } from '../services/runtime-lifecycle.service';
import { RuntimeContextEngineService } from '../services/runtime-context-engine.service';

@Controller('platform-os-v2/runtime')
export class RuntimePlatformController {
  constructor(
    private readonly enterpriseRuntimeV2: EnterpriseRuntimeV2Service,
    private readonly moduleRuntime: ModuleRuntimeService,
    private readonly dynamicModuleLoader: DynamicModuleLoaderService,
    private readonly runtimeRegistry: RuntimeRegistryService,
    private readonly runtimeHealthEngine: RuntimeHealthEngineService,
    private readonly runtimeDiagnostics: RuntimeDiagnosticsService,
    private readonly runtimeLifecycle: RuntimeLifecycleService,
    private readonly runtimeContextEngine: RuntimeContextEngineService,
  ) {}

  private services() {
    return {
      'enterprise-runtime-v2': this.enterpriseRuntimeV2,
      'module-runtime': this.moduleRuntime,
      'dynamic-module-loader': this.dynamicModuleLoader,
      'runtime-registry': this.runtimeRegistry,
      'runtime-health-engine': this.runtimeHealthEngine,
      'runtime-diagnostics': this.runtimeDiagnostics,
      'runtime-lifecycle': this.runtimeLifecycle,
      'runtime-context-engine': this.runtimeContextEngine,
    };
  }

  @Get('capabilities')
  capabilities() {
    return Object.keys(this.services());
  }

  @Get('health')
  health() {
    return Object.values(this.services()).map(
      (service) => service.health(),
    );
  }

  @Post(':capability/execute')
  execute(
    @Param('capability') capability: string,
    @Body() input: PlatformOperationDto,
  ) {
    const service = this.services()[
      capability as keyof ReturnType<RuntimePlatformController['services']>
    ];

    if (!service) {
      throw new Error(`Unknown capability: ${capability}`);
    }

    return service.execute(input.action, input.payload ?? {});
  }
}