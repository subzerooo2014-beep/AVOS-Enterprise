import { Controller, Get } from '@nestjs/common';
import { MultiTenantControlPlaneService } from './multi-tenant-control-plane.service';

@Controller('avos/future/global-platform/multi-tenant-control-plane')
export class MultiTenantControlPlaneController {
  constructor(private readonly service: MultiTenantControlPlaneService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}