import { Module } from '@nestjs/common';
import { MultiTenantControlPlaneController } from './multi-tenant-control-plane.controller';
import { MultiTenantControlPlaneService } from './multi-tenant-control-plane.service';

@Module({
  controllers: [MultiTenantControlPlaneController],
  providers: [MultiTenantControlPlaneService],
  exports: [MultiTenantControlPlaneService],
})
export class MultiTenantControlPlaneModule {}