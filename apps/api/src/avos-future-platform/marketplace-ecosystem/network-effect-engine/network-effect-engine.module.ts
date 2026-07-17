import { Module } from '@nestjs/common';
import { NetworkEffectEngineController } from './network-effect-engine.controller';
import { NetworkEffectEngineService } from './network-effect-engine.service';

@Module({
  controllers: [NetworkEffectEngineController],
  providers: [NetworkEffectEngineService],
  exports: [NetworkEffectEngineService],
})
export class NetworkEffectEngineModule {}