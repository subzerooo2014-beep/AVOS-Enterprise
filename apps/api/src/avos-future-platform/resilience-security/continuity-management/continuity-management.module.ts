import { Module } from '@nestjs/common';
import { ContinuityManagementController } from './continuity-management.controller';
import { ContinuityManagementService } from './continuity-management.service';

@Module({
  controllers: [ContinuityManagementController],
  providers: [ContinuityManagementService],
  exports: [ContinuityManagementService],
})
export class ContinuityManagementModule {}