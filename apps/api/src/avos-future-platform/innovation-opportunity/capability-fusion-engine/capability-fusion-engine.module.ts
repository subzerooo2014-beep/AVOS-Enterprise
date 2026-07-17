import { Module } from '@nestjs/common';
import { CapabilityFusionEngineController } from './capability-fusion-engine.controller';
import { CapabilityFusionEngineService } from './capability-fusion-engine.service';

@Module({
  controllers: [CapabilityFusionEngineController],
  providers: [CapabilityFusionEngineService],
  exports: [CapabilityFusionEngineService],
})
export class CapabilityFusionEngineModule {}