import { Module } from '@nestjs/common';
import { DataGovernanceCenterController } from './data-governance-center.controller';
import { DataGovernanceCenterService } from './data-governance-center.service';

@Module({
  controllers: [DataGovernanceCenterController],
  providers: [DataGovernanceCenterService],
  exports: [DataGovernanceCenterService],
})
export class DataGovernanceCenterModule {}