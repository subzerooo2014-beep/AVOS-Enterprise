import { Module } from '@nestjs/common';
import { ResilienceSimulatorController } from './resilience-simulator.controller';
import { ResilienceSimulatorService } from './resilience-simulator.service';

@Module({
  controllers: [ResilienceSimulatorController],
  providers: [ResilienceSimulatorService],
  exports: [ResilienceSimulatorService],
})
export class ResilienceSimulatorModule {}