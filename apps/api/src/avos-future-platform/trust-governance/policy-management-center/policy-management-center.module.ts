import { Module } from '@nestjs/common';
import { PolicyManagementCenterController } from './policy-management-center.controller';
import { PolicyManagementCenterService } from './policy-management-center.service';

@Module({
  controllers: [PolicyManagementCenterController],
  providers: [PolicyManagementCenterService],
  exports: [PolicyManagementCenterService],
})
export class PolicyManagementCenterModule {}