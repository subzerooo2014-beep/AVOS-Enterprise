import { Module } from '@nestjs/common';
import { IncidentLearningEngineController } from './incident-learning-engine.controller';
import { IncidentLearningEngineService } from './incident-learning-engine.service';

@Module({
  controllers: [IncidentLearningEngineController],
  providers: [IncidentLearningEngineService],
  exports: [IncidentLearningEngineService],
})
export class IncidentLearningEngineModule {}