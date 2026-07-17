import { Controller, Get } from '@nestjs/common';
import { UniversalVoiceBusService } from './universal-voice-bus.service';

@Controller('avos/future/voice-experience/universal-voice-bus')
export class UniversalVoiceBusController {
  constructor(private readonly service: UniversalVoiceBusService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}