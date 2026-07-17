import { Module } from '@nestjs/common';
import { GrowthBrainController } from './growth-brain.controller';
import { GrowthBrainService } from './growth-brain.service';

@Module({
  controllers: [GrowthBrainController],
  providers: [GrowthBrainService],
  exports: [GrowthBrainService],
})
export class GrowthBrainModule {}