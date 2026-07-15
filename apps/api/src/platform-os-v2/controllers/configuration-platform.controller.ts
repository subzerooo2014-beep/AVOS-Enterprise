import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PlatformOperationDto } from '../dto/platform-operation.dto';
import { DynamicConfigurationService } from '../services/dynamic-configuration.service';
import { EnvironmentProfileEngineService } from '../services/environment-profile-engine.service';
import { FeatureFlagEngineService } from '../services/feature-flag-engine.service';
import { SecretsProviderEngineService } from '../services/secrets-provider-engine.service';
import { ConfigurationValidationService } from '../services/configuration-validation.service';
import { ConfigurationVersioningService } from '../services/configuration-versioning.service';
import { ConfigurationLiveReloadService } from '../services/configuration-live-reload.service';
import { PolicyConfigurationService } from '../services/policy-configuration.service';

@Controller('platform-os-v2/configuration')
export class ConfigurationPlatformController {
  constructor(
    private readonly dynamicConfiguration: DynamicConfigurationService,
    private readonly environmentProfileEngine: EnvironmentProfileEngineService,
    private readonly featureFlagEngine: FeatureFlagEngineService,
    private readonly secretsProviderEngine: SecretsProviderEngineService,
    private readonly configurationValidation: ConfigurationValidationService,
    private readonly configurationVersioning: ConfigurationVersioningService,
    private readonly configurationLiveReload: ConfigurationLiveReloadService,
    private readonly policyConfiguration: PolicyConfigurationService,
  ) {}

  private services() {
    return {
      'dynamic-configuration': this.dynamicConfiguration,
      'environment-profile-engine': this.environmentProfileEngine,
      'feature-flag-engine': this.featureFlagEngine,
      'secrets-provider-engine': this.secretsProviderEngine,
      'configuration-validation': this.configurationValidation,
      'configuration-versioning': this.configurationVersioning,
      'configuration-live-reload': this.configurationLiveReload,
      'policy-configuration': this.policyConfiguration,
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
      capability as keyof ReturnType<ConfigurationPlatformController['services']>
    ];

    if (!service) {
      throw new Error(`Unknown capability: ${capability}`);
    }

    return service.execute(input.action, input.payload ?? {});
  }
}