import { Module } from '@nestjs/common';
import { ViralEngineController } from './viral-engine.controller';
import { ViralEngineService } from './viral-engine.service';

@Module({
  controllers: [ViralEngineController],
  providers: [ViralEngineService],
  exports: [ViralEngineService],
})
export class ViralEngineModule {}