import { Controller, Get } from '@nestjs/common';
import { ReferralEngineService } from './referral-engine.service';

@Controller('avos/future/growth-commerce/referral-engine')
export class ReferralEngineController {
  constructor(private readonly service: ReferralEngineService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}