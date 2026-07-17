import { Module } from '@nestjs/common';
import { LivingBlueprintSynchronizerController } from './living-blueprint-synchronizer.controller';
import { LivingBlueprintSynchronizerService } from './living-blueprint-synchronizer.service';

@Module({
  controllers: [LivingBlueprintSynchronizerController],
  providers: [LivingBlueprintSynchronizerService],
  exports: [LivingBlueprintSynchronizerService],
})
export class LivingBlueprintSynchronizerModule {}