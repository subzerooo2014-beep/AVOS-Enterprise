import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PlatformOperationDto } from '../dto/platform-operation.dto';
import { EnterpriseAppStoreService } from '../services/enterprise-app-store.service';
import { EnterprisePackageRegistryService } from '../services/enterprise-package-registry.service';
import { AppInstallationEngineService } from '../services/app-installation-engine.service';
import { AppUpdateEngineService } from '../services/app-update-engine.service';
import { AppRollbackEngineService } from '../services/app-rollback-engine.service';
import { LicenseManagerService } from '../services/license-manager.service';
import { EnterpriseCatalogService } from '../services/enterprise-catalog.service';
import { ReleaseChannelEngineService } from '../services/release-channel-engine.service';

@Controller('platform-os-v2/app-store')
export class AppStorePlatformController {
  constructor(
    private readonly enterpriseAppStore: EnterpriseAppStoreService,
    private readonly enterprisePackageRegistry: EnterprisePackageRegistryService,
    private readonly appInstallationEngine: AppInstallationEngineService,
    private readonly appUpdateEngine: AppUpdateEngineService,
    private readonly appRollbackEngine: AppRollbackEngineService,
    private readonly licenseManager: LicenseManagerService,
    private readonly enterpriseCatalog: EnterpriseCatalogService,
    private readonly releaseChannelEngine: ReleaseChannelEngineService,
  ) {}

  private services() {
    return {
      'enterprise-app-store': this.enterpriseAppStore,
      'enterprise-package-registry': this.enterprisePackageRegistry,
      'app-installation-engine': this.appInstallationEngine,
      'app-update-engine': this.appUpdateEngine,
      'app-rollback-engine': this.appRollbackEngine,
      'license-manager': this.licenseManager,
      'enterprise-catalog': this.enterpriseCatalog,
      'release-channel-engine': this.releaseChannelEngine,
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
      capability as keyof ReturnType<AppStorePlatformController['services']>
    ];

    if (!service) {
      throw new Error(`Unknown capability: ${capability}`);
    }

    return service.execute(input.action, input.payload ?? {});
  }
}