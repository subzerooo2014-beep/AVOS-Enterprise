import { Module } from '@nestjs/common';
import { DataLakehouseController } from './data-lakehouse.controller';
import { DataLakehouseService } from './data-lakehouse.service';

@Module({
  controllers: [DataLakehouseController],
  providers: [DataLakehouseService],
  exports: [DataLakehouseService],
})
export class DataLakehouseModule {}