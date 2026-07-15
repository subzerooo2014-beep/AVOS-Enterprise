import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PlatformOperationDto } from '../dto/platform-operation.dto';
import { AutoRegistrationEngineService } from '../services/auto-registration-engine.service';
import { AutoDiscoveryEngineService } from '../services/auto-discovery-engine.service';
import { AutoUpgradeEngineService } from '../services/auto-upgrade-engine.service';
import { AutoRollbackEngineService } from '../services/auto-rollback-engine.service';
import { AutoRecoveryEngineService } from '../services/auto-recovery-engine.service';
import { AutoDiagnosticsEngineService } from '../services/auto-diagnostics-engine.service';
import { AutoOptimizationEngineService } from '../services/auto-optimization-engine.service';
import { AutoValidationEngineService } from '../services/auto-validation-engine.service';

@Controller('platform-os-v2/automation')
export class AutomationPlatformController {
  constructor(
    private readonly autoRegistrationEngine: AutoRegistrationEngineService,
    private readonly autoDiscoveryEngine: AutoDiscoveryEngineService,
    private readonly autoUpgradeEngine: AutoUpgradeEngineService,
    private readonly autoRollbackEngine: AutoRollbackEngineService,
    private readonly autoRecoveryEngine: AutoRecoveryEngineService,
    private readonly autoDiagnosticsEngine: AutoDiagnosticsEngineService,
    private readonly autoOptimizationEngine: AutoOptimizationEngineService,
    private readonly autoValidationEngine: AutoValidationEngineService,
  ) {}

  private services() {
    return {
      'auto-registration-engine': this.autoRegistrationEngine,
      'auto-discovery-engine': this.autoDiscoveryEngine,
      'auto-upgrade-engine': this.autoUpgradeEngine,
      'auto-rollback-engine': this.autoRollbackEngine,
      'auto-recovery-engine': this.autoRecoveryEngine,
      'auto-diagnostics-engine': this.autoDiagnosticsEngine,
      'auto-optimization-engine': this.autoOptimizationEngine,
      'auto-validation-engine': this.autoValidationEngine,
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
      capability as keyof ReturnType<AutomationPlatformController['services']>
    ];

    if (!service) {
      throw new Error(`Unknown capability: ${capability}`);
    }

    return service.execute(input.action, input.payload ?? {});
  }
}