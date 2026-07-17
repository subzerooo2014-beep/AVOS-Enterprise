import { Module } from '@nestjs/common';
import { GenesisEngineController } from './genesis-engine.controller';
import { GenesisEngineService } from './genesis-engine.service';

@Module({
  controllers: [GenesisEngineController],
  providers: [GenesisEngineService],
  exports: [GenesisEngineService],
})
export class GenesisEngineModule {}