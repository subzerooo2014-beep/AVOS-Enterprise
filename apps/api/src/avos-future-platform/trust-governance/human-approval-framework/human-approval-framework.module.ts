import { Module } from '@nestjs/common';
import { HumanApprovalFrameworkController } from './human-approval-framework.controller';
import { HumanApprovalFrameworkService } from './human-approval-framework.service';

@Module({
  controllers: [HumanApprovalFrameworkController],
  providers: [HumanApprovalFrameworkService],
  exports: [HumanApprovalFrameworkService],
})
export class HumanApprovalFrameworkModule {}