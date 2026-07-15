import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PlatformOperationDto } from '../dto/platform-operation.dto';
import { BackendSdkService } from '../services/backend-sdk.service';
import { FlutterSdkService } from '../services/flutter-sdk.service';
import { WebSdkService } from '../services/web-sdk.service';
import { PartnerSdkService } from '../services/partner-sdk.service';
import { IntegrationSdkService } from '../services/integration-sdk.service';
import { TestingSdkService } from '../services/testing-sdk.service';
import { CliSdkService } from '../services/cli-sdk.service';
import { GeneratorSdkService } from '../services/generator-sdk.service';

@Controller('platform-os-v2/sdk')
export class SdkPlatformController {
  constructor(
    private readonly backendSdk: BackendSdkService,
    private readonly flutterSdk: FlutterSdkService,
    private readonly webSdk: WebSdkService,
    private readonly partnerSdk: PartnerSdkService,
    private readonly integrationSdk: IntegrationSdkService,
    private readonly testingSdk: TestingSdkService,
    private readonly cliSdk: CliSdkService,
    private readonly generatorSdk: GeneratorSdkService,
  ) {}

  private services() {
    return {
      'backend-sdk': this.backendSdk,
      'flutter-sdk': this.flutterSdk,
      'web-sdk': this.webSdk,
      'partner-sdk': this.partnerSdk,
      'integration-sdk': this.integrationSdk,
      'testing-sdk': this.testingSdk,
      'cli-sdk': this.cliSdk,
      'generator-sdk': this.generatorSdk,
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
      capability as keyof ReturnType<SdkPlatformController['services']>
    ];

    if (!service) {
      throw new Error(Unknown capability: ${capability});
    }

    return service.execute(input.action, input.payload ?? {});
  }
}