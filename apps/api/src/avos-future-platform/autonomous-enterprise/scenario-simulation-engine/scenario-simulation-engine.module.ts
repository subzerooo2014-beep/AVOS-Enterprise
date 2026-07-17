import { Module } from '@nestjs/common';
import { ScenarioSimulationEngineController } from './scenario-simulation-engine.controller';
import { ScenarioSimulationEngineService } from './scenario-simulation-engine.service';

@Module({
  controllers: [ScenarioSimulationEngineController],
  providers: [ScenarioSimulationEngineService],
  exports: [ScenarioSimulationEngineService],
})
export class ScenarioSimulationEngineModule {}