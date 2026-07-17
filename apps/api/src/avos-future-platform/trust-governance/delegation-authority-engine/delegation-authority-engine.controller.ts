import { Controller, Get } from '@nestjs/common';
import { DelegationAuthorityEngineService } from './delegation-authority-engine.service';

@Controller('avos/future/trust-governance/delegation-authority-engine')
export class DelegationAuthorityEngineController {
  constructor(private readonly service: DelegationAuthorityEngineService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}