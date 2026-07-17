import { Controller, Get } from '@nestjs/common';
import { BusinessIntelligenceCenterService } from './business-intelligence-center.service';

@Controller('avos/future/data-intelligence/business-intelligence-center')
export class BusinessIntelligenceCenterController {
  constructor(private readonly service: BusinessIntelligenceCenterService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}