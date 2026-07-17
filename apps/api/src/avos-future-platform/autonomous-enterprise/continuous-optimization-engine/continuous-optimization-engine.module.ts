import { Module } from '@nestjs/common';
import { ContinuousOptimizationEngineController } from './continuous-optimization-engine.controller';
import { ContinuousOptimizationEngineService } from './continuous-optimization-engine.service';

@Module({
  controllers: [ContinuousOptimizationEngineController],
  providers: [ContinuousOptimizationEngineService],
  exports: [ContinuousOptimizationEngineService],
})
export class ContinuousOptimizationEngineModule {}