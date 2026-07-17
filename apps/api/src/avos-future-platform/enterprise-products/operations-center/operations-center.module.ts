import { Module } from '@nestjs/common';
import { OperationsCenterController } from './operations-center.controller';
import { OperationsCenterService } from './operations-center.service';

@Module({
  controllers: [OperationsCenterController],
  providers: [OperationsCenterService],
  exports: [OperationsCenterService],
})
export class OperationsCenterModule {}