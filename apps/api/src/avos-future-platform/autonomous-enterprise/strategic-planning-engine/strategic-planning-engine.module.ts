import { Module } from '@nestjs/common';
import { StrategicPlanningEngineController } from './strategic-planning-engine.controller';
import { StrategicPlanningEngineService } from './strategic-planning-engine.service';

@Module({
  controllers: [StrategicPlanningEngineController],
  providers: [StrategicPlanningEngineService],
  exports: [StrategicPlanningEngineService],
})
export class StrategicPlanningEngineModule {}