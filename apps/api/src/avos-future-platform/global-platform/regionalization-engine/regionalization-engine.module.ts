import { Module } from '@nestjs/common';
import { RegionalizationEngineController } from './regionalization-engine.controller';
import { RegionalizationEngineService } from './regionalization-engine.service';

@Module({
  controllers: [RegionalizationEngineController],
  providers: [RegionalizationEngineService],
  exports: [RegionalizationEngineService],
})
export class RegionalizationEngineModule {}