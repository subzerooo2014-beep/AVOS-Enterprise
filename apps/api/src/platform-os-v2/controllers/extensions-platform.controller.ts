import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PlatformOperationDto } from '../dto/platform-operation.dto';
import { ExtensionSdkService } from '../services/extension-sdk.service';
import { ExtensionLoaderService } from '../services/extension-loader.service';
import { ExtensionApiEngineService } from '../services/extension-api-engine.service';
import { ExtensionLifecycleService } from '../services/extension-lifecycle.service';
import { ExtensionSecurityService } from '../services/extension-security.service';
import { ExtensionEventsService } from '../services/extension-events.service';
import { ExtensionStorageService } from '../services/extension-storage.service';
import { ExtensionMarketplaceService } from '../services/extension-marketplace.service';

@Controller('platform-os-v2/extensions')
export class ExtensionsPlatformController {
  constructor(
    private readonly extensionSdk: ExtensionSdkService,
    private readonly extensionLoader: ExtensionLoaderService,
    private readonly extensionApiEngine: ExtensionApiEngineService,
    private readonly extensionLifecycle: ExtensionLifecycleService,
    private readonly extensionSecurity: ExtensionSecurityService,
    private readonly extensionEvents: ExtensionEventsService,
    private readonly extensionStorage: ExtensionStorageService,
    private readonly extensionMarketplace: ExtensionMarketplaceService,
  ) {}

  private services() {
    return {
      'extension-sdk': this.extensionSdk,
      'extension-loader': this.extensionLoader,
      'extension-api-engine': this.extensionApiEngine,
      'extension-lifecycle': this.extensionLifecycle,
      'extension-security': this.extensionSecurity,
      'extension-events': this.extensionEvents,
      'extension-storage': this.extensionStorage,
      'extension-marketplace': this.extensionMarketplace,
    };
  }

  @Get('capabilities')
  capabilities() {
    return Object.keys(this.services());
  }

  @Get('health')
  health() {
    return Object.entries(this.services()).map(
      ([capability, service]) => ({
        capability,
        ...service.health(),
      }),
    );
  }

  @Post(':capability/execute')
  execute(
    @Param('capability') capability: string,
    @Body() input: PlatformOperationDto,
  ) {
    const service = this.services()[
      capability as keyof ReturnType<ExtensionsPlatformController['services']>
    ];

    if (!service) {
      throw new Error(Unknown capability: ${capability});
    }

    return service.execute(input.action, input.payload ?? {});
  }
}