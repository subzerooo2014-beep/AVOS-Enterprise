import { Controller, Get } from '@nestjs/common';
import { VoiceOsService } from './voice-os.service';

@Controller('avos/future/voice-experience/voice-os')
export class VoiceOsController {
  constructor(private readonly service: VoiceOsService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}