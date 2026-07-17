import { Module } from '@nestjs/common';
import { MobilityScenarioSimulatorController } from './mobility-scenario-simulator.controller';
import { MobilityScenarioSimulatorService } from './mobility-scenario-simulator.service';

@Module({
  controllers: [MobilityScenarioSimulatorController],
  providers: [MobilityScenarioSimulatorService],
  exports: [MobilityScenarioSimulatorService],
})
export class MobilityScenarioSimulatorModule {}