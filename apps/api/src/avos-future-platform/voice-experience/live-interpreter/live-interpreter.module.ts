import { Module } from '@nestjs/common';
import { LiveInterpreterController } from './live-interpreter.controller';
import { LiveInterpreterService } from './live-interpreter.service';

@Module({
  controllers: [LiveInterpreterController],
  providers: [LiveInterpreterService],
  exports: [LiveInterpreterService],
})
export class LiveInterpreterModule {}