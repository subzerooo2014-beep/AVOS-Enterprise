import { Controller, Get } from '@nestjs/common';
import { InsurancePlatformService } from './insurance-platform.service';

@Controller('avos/future/mobility-industry/insurance-platform')
export class InsurancePlatformController {
  constructor(private readonly service: InsurancePlatformService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}