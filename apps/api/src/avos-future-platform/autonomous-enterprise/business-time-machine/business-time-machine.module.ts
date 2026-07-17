import { Module } from '@nestjs/common';
import { BusinessTimeMachineController } from './business-time-machine.controller';
import { BusinessTimeMachineService } from './business-time-machine.service';

@Module({
  controllers: [BusinessTimeMachineController],
  providers: [BusinessTimeMachineService],
  exports: [BusinessTimeMachineService],
})
export class BusinessTimeMachineModule {}