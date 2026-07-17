import { Module } from '@nestjs/common';
import { GlobalOperationsCenterController } from './global-operations-center.controller';
import { GlobalOperationsCenterService } from './global-operations-center.service';

@Module({
  controllers: [GlobalOperationsCenterController],
  providers: [GlobalOperationsCenterService],
  exports: [GlobalOperationsCenterService],
})
export class GlobalOperationsCenterModule {}