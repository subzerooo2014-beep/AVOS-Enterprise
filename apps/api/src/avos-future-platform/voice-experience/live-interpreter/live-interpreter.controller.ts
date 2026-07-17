import { Controller, Get } from '@nestjs/common';
import { LiveInterpreterService } from './live-interpreter.service';

@Controller('avos/future/voice-experience/live-interpreter')
export class LiveInterpreterController {
  constructor(private readonly service: LiveInterpreterService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}