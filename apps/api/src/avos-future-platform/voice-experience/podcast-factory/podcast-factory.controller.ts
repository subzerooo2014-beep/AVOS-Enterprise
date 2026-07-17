import { Controller, Get } from '@nestjs/common';
import { PodcastFactoryService } from './podcast-factory.service';

@Controller('avos/future/voice-experience/podcast-factory')
export class PodcastFactoryController {
  constructor(private readonly service: PodcastFactoryService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}