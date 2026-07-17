import { Controller, Get } from '@nestjs/common';
import { FutureScannerService } from './future-scanner.service';

@Controller('avos/future/innovation-opportunity/future-scanner')
export class FutureScannerController {
  constructor(private readonly service: FutureScannerService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}