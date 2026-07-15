import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PlatformOperationDto } from '../dto/platform-operation.dto';
import { PluginRegistryService } from '../services/plugin-registry.service';
import { PluginInstallerService } from '../services/plugin-installer.service';
import { PluginMarketplaceService } from '../services/plugin-marketplace.service';
import { PluginSandboxService } from '../services/plugin-sandbox.service';
import { PluginSecurityService } from '../services/plugin-security.service';
import { PluginPermissionsService } from '../services/plugin-permissions.service';
import { PluginVersioningService } from '../services/plugin-versioning.service';
import { PluginDependenciesService } from '../services/plugin-dependencies.service';
import { PluginUpdateEngineService } from '../services/plugin-update-engine.service';
import { PluginRollbackEngineService } from '../services/plugin-rollback-engine.service';

@Controller('platform-os-v2/plugins')
export class PluginsPlatformController {
  constructor(
    private readonly pluginRegistry: PluginRegistryService,
    private readonly pluginInstaller: PluginInstallerService,
    private readonly pluginMarketplace: PluginMarketplaceService,
    private readonly pluginSandbox: PluginSandboxService,
    private readonly pluginSecurity: PluginSecurityService,
    private readonly pluginPermissions: PluginPermissionsService,
    private readonly pluginVersioning: PluginVersioningService,
    private readonly pluginDependencies: PluginDependenciesService,
    private readonly pluginUpdateEngine: PluginUpdateEngineService,
    private readonly pluginRollbackEngine: PluginRollbackEngineService,
  ) {}

  private services() {
    return {
      'plugin-registry': this.pluginRegistry,
      'plugin-installer': this.pluginInstaller,
      'plugin-marketplace': this.pluginMarketplace,
      'plugin-sandbox': this.pluginSandbox,
      'plugin-security': this.pluginSecurity,
      'plugin-permissions': this.pluginPermissions,
      'plugin-versioning': this.pluginVersioning,
      'plugin-dependencies': this.pluginDependencies,
      'plugin-update-engine': this.pluginUpdateEngine,
      'plugin-rollback-engine': this.pluginRollbackEngine,
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
      capability as keyof ReturnType<PluginsPlatformController['services']>
    ];

    if (!service) {
      throw new Error(`Unknown capability: ${capability}`);
    }

    return service.execute(input.action, input.payload ?? {});
  }
}