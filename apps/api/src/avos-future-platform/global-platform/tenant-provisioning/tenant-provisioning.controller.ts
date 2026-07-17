import { Controller, Get } from '@nestjs/common';
import { TenantProvisioningService } from './tenant-provisioning.service';

@Controller('avos/future/global-platform/tenant-provisioning')
export class TenantProvisioningController {
  constructor(private readonly service: TenantProvisioningService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}