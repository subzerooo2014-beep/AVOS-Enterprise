import { Controller, Get } from '@nestjs/common';
import { AiRadioService } from './ai-radio.service';

@Controller('avos/future/voice-experience/ai-radio')
export class AiRadioController {
  constructor(private readonly service: AiRadioService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}