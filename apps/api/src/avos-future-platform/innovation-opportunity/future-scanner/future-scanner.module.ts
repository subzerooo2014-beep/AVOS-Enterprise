import { Module } from '@nestjs/common';
import { FutureScannerController } from './future-scanner.controller';
import { FutureScannerService } from './future-scanner.service';

@Module({
  controllers: [FutureScannerController],
  providers: [FutureScannerService],
  exports: [FutureScannerService],
})
export class FutureScannerModule {}