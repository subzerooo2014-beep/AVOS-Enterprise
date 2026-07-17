import { Module } from '@nestjs/common';
import { ThreatAnticipationEngineController } from './threat-anticipation-engine.controller';
import { ThreatAnticipationEngineService } from './threat-anticipation-engine.service';

@Module({
  controllers: [ThreatAnticipationEngineController],
  providers: [ThreatAnticipationEngineService],
  exports: [ThreatAnticipationEngineService],
})
export class ThreatAnticipationEngineModule {}