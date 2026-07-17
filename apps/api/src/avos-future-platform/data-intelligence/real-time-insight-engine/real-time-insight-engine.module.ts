import { Module } from '@nestjs/common';
import { RealTimeInsightEngineController } from './real-time-insight-engine.controller';
import { RealTimeInsightEngineService } from './real-time-insight-engine.service';

@Module({
  controllers: [RealTimeInsightEngineController],
  providers: [RealTimeInsightEngineService],
  exports: [RealTimeInsightEngineService],
})
export class RealTimeInsightEngineModule {}