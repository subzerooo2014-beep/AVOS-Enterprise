import { Controller, Get } from '@nestjs/common';
import { WeakSignalDetectorService } from './weak-signal-detector.service';

@Controller('avos/future/resilience-security/weak-signal-detector')
export class WeakSignalDetectorController {
  constructor(private readonly service: WeakSignalDetectorService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}