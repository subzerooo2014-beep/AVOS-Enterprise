import { Module } from '@nestjs/common';
import { TrustScoreEngineController } from './trust-score-engine.controller';
import { TrustScoreEngineService } from './trust-score-engine.service';

@Module({
  controllers: [TrustScoreEngineController],
  providers: [TrustScoreEngineService],
  exports: [TrustScoreEngineService],
})
export class TrustScoreEngineModule {}