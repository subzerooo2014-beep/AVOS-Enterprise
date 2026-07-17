import { Module } from '@nestjs/common';
import { AnalyticsFabricController } from './analytics-fabric.controller';
import { AnalyticsFabricService } from './analytics-fabric.service';

@Module({
  controllers: [AnalyticsFabricController],
  providers: [AnalyticsFabricService],
  exports: [AnalyticsFabricService],
})
export class AnalyticsFabricModule {}