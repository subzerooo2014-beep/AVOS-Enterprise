import { Module } from '@nestjs/common';
import { DataLineageController } from './data-lineage.controller';
import { DataLineageService } from './data-lineage.service';

@Module({
  controllers: [DataLineageController],
  providers: [DataLineageService],
  exports: [DataLineageService],
})
export class DataLineageModule {}