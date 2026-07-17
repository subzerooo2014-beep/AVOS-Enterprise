import { Controller, Get } from '@nestjs/common';
import { LicenseManagementService } from './license-management.service';

@Controller('avos/future/global-platform/license-management')
export class LicenseManagementController {
  constructor(private readonly service: LicenseManagementService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}