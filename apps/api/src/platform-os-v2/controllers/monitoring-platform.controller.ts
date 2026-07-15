import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PlatformOperationDto } from '../dto/platform-operation.dto';
import { RuntimeDashboardEngineService } from '../services/runtime-dashboard-engine.service';
import { ModuleDashboardEngineService } from '../services/module-dashboard-engine.service';
import { PluginDashboardEngineService } from '../services/plugin-dashboard-engine.service';
import { HealthDashboardEngineService } from '../services/health-dashboard-engine.service';
import { PlatformMetricsEngineService } from '../services/platform-metrics-engine.service';
import { PlatformAlertsEngineService } from '../services/platform-alerts-engine.service';
import { PlatformAuditEngineService } from '../services/platform-audit-engine.service';
import { PlatformTelemetryEngineService } from '../services/platform-telemetry-engine.service';

@Controller('platform-os-v2/monitoring')
export class MonitoringPlatformController {
  constructor(
    private readonly runtimeDashboardEngine: RuntimeDashboardEngineService,
    private readonly moduleDashboardEngine: ModuleDashboardEngineService,
    private readonly pluginDashboardEngine: PluginDashboardEngineService,
    private readonly healthDashboardEngine: HealthDashboardEngineService,
    private readonly platformMetricsEngine: PlatformMetricsEngineService,
    private readonly platformAlertsEngine: PlatformAlertsEngineService,
    private readonly platformAuditEngine: PlatformAuditEngineService,
    private readonly platformTelemetryEngine: PlatformTelemetryEngineService,
  ) {}

  private services() {
    return {
      'runtime-dashboard-engine': this.runtimeDashboardEngine,
      'module-dashboard-engine': this.moduleDashboardEngine,
      'plugin-dashboard-engine': this.pluginDashboardEngine,
      'health-dashboard-engine': this.healthDashboardEngine,
      'platform-metrics-engine': this.platformMetricsEngine,
      'platform-alerts-engine': this.platformAlertsEngine,
      'platform-audit-engine': this.platformAuditEngine,
      'platform-telemetry-engine': this.platformTelemetryEngine,
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
      capability as keyof ReturnType<MonitoringPlatformController['services']>
    ];

    if (!service) {
      throw new Error(Unknown capability: ${capability});
    }

    return service.execute(input.action, input.payload ?? {});
  }
}