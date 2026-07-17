import { Controller, Get } from '@nestjs/common';
import { ComplianceIntelligenceService } from './compliance-intelligence.service';

@Controller('avos/future/trust-governance/compliance-intelligence')
export class ComplianceIntelligenceController {
  constructor(private readonly service: ComplianceIntelligenceService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}