import { Controller, Get } from '@nestjs/common';
import { FinancingPlatformService } from './financing-platform.service';

@Controller('avos/future/mobility-industry/financing-platform')
export class FinancingPlatformController {
  constructor(private readonly service: FinancingPlatformService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}