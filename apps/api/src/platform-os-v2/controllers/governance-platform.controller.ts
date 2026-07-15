import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PlatformOperationDto } from '../dto/platform-operation.dto';
import { ModulePolicyEngineService } from '../services/module-policy-engine.service';
import { RuntimePolicyEngineService } from '../services/runtime-policy-engine.service';
import { PluginGovernanceService } from '../services/plugin-governance.service';
import { DependencyGovernanceService } from '../services/dependency-governance.service';
import { SecurityGovernanceService } from '../services/security-governance.service';
import { UpgradeGovernanceService } from '../services/upgrade-governance.service';
import { CompatibilityEngineService } from '../services/compatibility-engine.service';
import { PolicyEnforcementEngineService } from '../services/policy-enforcement-engine.service';

@Controller('platform-os-v2/governance')
export class GovernancePlatformController {
  constructor(
    private readonly modulePolicyEngine: ModulePolicyEngineService,
    private readonly runtimePolicyEngine: RuntimePolicyEngineService,
    private readonly pluginGovernance: PluginGovernanceService,
    private readonly dependencyGovernance: DependencyGovernanceService,
    private readonly securityGovernance: SecurityGovernanceService,
    private readonly upgradeGovernance: UpgradeGovernanceService,
    private readonly compatibilityEngine: CompatibilityEngineService,
    private readonly policyEnforcementEngine: PolicyEnforcementEngineService,
  ) {}

  private services() {
    return {
      'module-policy-engine': this.modulePolicyEngine,
      'runtime-policy-engine': this.runtimePolicyEngine,
      'plugin-governance': this.pluginGovernance,
      'dependency-governance': this.dependencyGovernance,
      'security-governance': this.securityGovernance,
      'upgrade-governance': this.upgradeGovernance,
      'compatibility-engine': this.compatibilityEngine,
      'policy-enforcement-engine': this.policyEnforcementEngine,
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
      capability as keyof ReturnType<GovernancePlatformController['services']>
    ];

    if (!service) {
      throw new Error(Unknown capability: ${capability});
    }

    return service.execute(input.action, input.payload ?? {});
  }
}