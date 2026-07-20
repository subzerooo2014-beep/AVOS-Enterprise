import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApcpProductionCapabilityService } from '../services/apcp-production-capability.service';
import { ApcpFactoryIntegrationService } from '../services/apcp-factory-integration.service';
import { ApcpUnifiedCertificationIntegrationService } from '../services/apcp-unified-certification-integration.service';
import { ApcpProductionE2eOrchestratorService } from '../services/apcp-production-e2e-orchestrator.service';

@Controller('avos/apcp-production-capability')
export class ApcpProductionCapabilityController {
  constructor(
    private readonly capability: ApcpProductionCapabilityService,
    private readonly factory: ApcpFactoryIntegrationService,
    private readonly unifiedCertification: ApcpUnifiedCertificationIntegrationService,
    private readonly e2e: ApcpProductionE2eOrchestratorService,
  ) {}

  @Get('status')
  status() {
    return this.capability.status();
  }

  @Get('factory/descriptor')
  factoryDescriptor() {
    return this.factory.descriptor();
  }

  @Post('factory/execute')
  factoryExecute(
    @Body()
    body: {
      score?: number;
      risk?: number;
      approvedBy?: string;
    },
  ) {
    return this.factory.executeProductionReadiness(body);
  }

  @Get('unified-certification/contribution')
  unifiedCertificationContribution() {
    return this.unifiedCertification.contribution();
  }

  @Post('e2e/run')
  runE2e(@Body() body?: { approvedBy?: string }) {
    return this.e2e.run(body?.approvedBy);
  }
}