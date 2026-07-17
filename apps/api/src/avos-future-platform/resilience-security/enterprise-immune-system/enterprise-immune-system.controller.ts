import { Controller, Get } from '@nestjs/common';
import { EnterpriseImmuneSystemService } from './enterprise-immune-system.service';

@Controller('avos/future/resilience-security/enterprise-immune-system')
export class EnterpriseImmuneSystemController {
  constructor(private readonly service: EnterpriseImmuneSystemService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}