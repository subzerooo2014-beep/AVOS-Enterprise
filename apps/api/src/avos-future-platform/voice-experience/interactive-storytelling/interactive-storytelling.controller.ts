import { Controller, Get } from '@nestjs/common';
import { InteractiveStorytellingService } from './interactive-storytelling.service';

@Controller('avos/future/voice-experience/interactive-storytelling')
export class InteractiveStorytellingController {
  constructor(private readonly service: InteractiveStorytellingService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}