import { Controller, Get } from '@nestjs/common';
import { PlatformOsV2OrchestratorService } from './platform-os-v2-orchestrator.service';
import { PlatformOsV2DashboardService } from './platform-os-v2-dashboard.service';
import { PLATFORM_OS_V2_CAPABILITIES } from './platform-os-v2.types';

@Controller('platform-os-v2')
export class PlatformOsV2Controller {
  constructor(
    private readonly orchestrator: PlatformOsV2OrchestratorService,
    private readonly dashboard: PlatformOsV2DashboardService,
  ) {}

  @Get('capabilities')
  capabilities() {
    return {
      system: 'Mega System 1 — AVOS Platform OS',
      count: PLATFORM_OS_V2_CAPABILITIES.length,
      capabilities: PLATFORM_OS_V2_CAPABILITIES,
    };
  }

  @Get('health')
  health() {
    return this.orchestrator.health();
  }

  @Get('dashboard')
  dashboardSnapshot() {
    const health = this.orchestrator.health();

    return this.dashboard.snapshot({
      healthyComponents: health.healthy,
      platformScore: health.platformHealthy ? 100 : 0,
    });
  }
}