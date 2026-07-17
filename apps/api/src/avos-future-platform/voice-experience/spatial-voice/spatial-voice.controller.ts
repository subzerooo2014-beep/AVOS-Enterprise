import { Controller, Get } from '@nestjs/common';
import { SpatialVoiceService } from './spatial-voice.service';

@Controller('avos/future/voice-experience/spatial-voice')
export class SpatialVoiceController {
  constructor(private readonly service: SpatialVoiceService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}