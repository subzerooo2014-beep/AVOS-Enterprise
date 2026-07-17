import { Controller, Get } from '@nestjs/common';
import { EnterpriseRiskEngineService } from './enterprise-risk-engine.service';

@Controller('avos/future/trust-governance/enterprise-risk-engine')
export class EnterpriseRiskEngineController {
  constructor(private readonly service: EnterpriseRiskEngineService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}