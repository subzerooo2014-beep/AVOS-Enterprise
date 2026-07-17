import { Module } from '@nestjs/common';
import { RecoveryPlannerController } from './recovery-planner.controller';
import { RecoveryPlannerService } from './recovery-planner.service';

@Module({
  controllers: [RecoveryPlannerController],
  providers: [RecoveryPlannerService],
  exports: [RecoveryPlannerService],
})
export class RecoveryPlannerModule {}