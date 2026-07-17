import { Controller, Get } from '@nestjs/common';
import { VoiceCommandCenterService } from './voice-command-center.service';

@Controller('avos/future/voice-experience/voice-command-center')
export class VoiceCommandCenterController {
  constructor(private readonly service: VoiceCommandCenterService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}