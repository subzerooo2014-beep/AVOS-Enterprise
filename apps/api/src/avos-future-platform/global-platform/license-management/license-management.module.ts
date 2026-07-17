import { Module } from '@nestjs/common';
import { LicenseManagementController } from './license-management.controller';
import { LicenseManagementService } from './license-management.service';

@Module({
  controllers: [LicenseManagementController],
  providers: [LicenseManagementService],
  exports: [LicenseManagementService],
})
export class LicenseManagementModule {}