import { Module } from '@nestjs/common';
import { SelfHealingEngineController } from './self-healing-engine.controller';
import { SelfHealingEngineService } from './self-healing-engine.service';

@Module({
  controllers: [SelfHealingEngineController],
  providers: [SelfHealingEngineService],
  exports: [SelfHealingEngineService],
})
export class SelfHealingEngineModule {}