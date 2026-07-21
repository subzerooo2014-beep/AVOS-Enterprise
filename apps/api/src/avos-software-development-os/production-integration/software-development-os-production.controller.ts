import { Body, Controller, Get, Post } from '@nestjs/common';
import { SoftwareDevelopmentOsProductionService } from './software-development-os-production.service';

@Controller('avos/software-development-os/production')
export class SoftwareDevelopmentOsProductionController {
  constructor(
    private readonly productionService: SoftwareDevelopmentOsProductionService,
  ) {}

  @Get('status')
  status() {
    return this.productionService.getStatus();
  }

  @Get('verify')
  verify() {
    return this.productionService.verify();
  }

  @Post('certify')
  certify(@Body() body?: { approvedBy?: string }) {
    return this.productionService.certify(body?.approvedBy);
  }

  @Get('certification')
  certification() {
    return this.productionService.getCertification();
  }
}
