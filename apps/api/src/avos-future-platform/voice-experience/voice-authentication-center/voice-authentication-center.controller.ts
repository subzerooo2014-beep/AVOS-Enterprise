import { Controller, Get } from '@nestjs/common';
import { VoiceAuthenticationCenterService } from './voice-authentication-center.service';

@Controller('avos/future/voice-experience/voice-authentication-center')
export class VoiceAuthenticationCenterController {
  constructor(private readonly service: VoiceAuthenticationCenterService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}