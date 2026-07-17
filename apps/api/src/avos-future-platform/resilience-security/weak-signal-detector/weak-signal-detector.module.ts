import { Module } from '@nestjs/common';
import { WeakSignalDetectorController } from './weak-signal-detector.controller';
import { WeakSignalDetectorService } from './weak-signal-detector.service';

@Module({
  controllers: [WeakSignalDetectorController],
  providers: [WeakSignalDetectorService],
  exports: [WeakSignalDetectorService],
})
export class WeakSignalDetectorModule {}