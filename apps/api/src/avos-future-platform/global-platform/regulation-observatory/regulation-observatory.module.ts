import { Module } from '@nestjs/common';
import { RegulationObservatoryController } from './regulation-observatory.controller';
import { RegulationObservatoryService } from './regulation-observatory.service';

@Module({
  controllers: [RegulationObservatoryController],
  providers: [RegulationObservatoryService],
  exports: [RegulationObservatoryService],
})
export class RegulationObservatoryModule {}