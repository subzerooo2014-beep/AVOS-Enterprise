import { Body, Controller, Get, Post } from '@nestjs/common';
import { ConnectorRegistrationDto } from './dto/connector-registration.dto';
import { FederationManagementDto } from './dto/federation-management.dto';
import { SynchronizationDto } from './dto/synchronization.dto';
import { EnterpriseIntegrationHubService } from './enterprise-integration-hub.service';
import { FederationManagementEngineService } from './federation-management-engine.service';
import { CrossPlatformSynchronizationEngineService } from './cross-platform-synchronization-engine.service';
import { IntegrationIntelligenceDashboardService } from './integration-intelligence-dashboard.service';
import { ENTERPRISE_INTEGRATION_FEDERATION_CAPABILITIES } from './enterprise-integration-federation.types';

@Controller('enterprise-integration-federation')
export class EnterpriseIntegrationFederationController {
  constructor(
    private readonly hub: EnterpriseIntegrationHubService,
    private readonly federation: FederationManagementEngineService,
    private readonly synchronization: CrossPlatformSynchronizationEngineService,
    private readonly dashboard: IntegrationIntelligenceDashboardService,
  ) {}

  @Get('capabilities')
  capabilities() {
    return {
      bundle:
        'Ultra Bundle L — Enterprise Integration & Federation Foundation',
      count: ENTERPRISE_INTEGRATION_FEDERATION_CAPABILITIES.length,
      capabilities: ENTERPRISE_INTEGRATION_FEDERATION_CAPABILITIES,
    };
  }

  @Post('connectors/register')
  registerConnector(@Body() input: ConnectorRegistrationDto) {
    return this.hub.register(input);
  }

  @Post('federation/manage')
  manageFederation(@Body() input: FederationManagementDto) {
    return this.federation.manage(input.nodes);
  }

  @Post('synchronization/analyze')
  analyzeSynchronization(@Body() input: SynchronizationDto) {
    return this.synchronization.analyze(input.records);
  }

  @Get('dashboard')
  dashboardSnapshot() {
    return this.dashboard.snapshot();
  }
}