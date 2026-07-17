import { Module } from '@nestjs/common';
import { IdeaEvolutionEngineController } from './idea-evolution-engine.controller';
import { IdeaEvolutionEngineService } from './idea-evolution-engine.service';

@Module({
  controllers: [IdeaEvolutionEngineController],
  providers: [IdeaEvolutionEngineService],
  exports: [IdeaEvolutionEngineService],
})
export class IdeaEvolutionEngineModule {}