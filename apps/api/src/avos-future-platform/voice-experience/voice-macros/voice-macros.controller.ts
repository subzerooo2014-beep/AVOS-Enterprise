import { Controller, Get } from '@nestjs/common';
import { VoiceMacrosService } from './voice-macros.service';

@Controller('avos/future/voice-experience/voice-macros')
export class VoiceMacrosController {
  constructor(private readonly service: VoiceMacrosService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}