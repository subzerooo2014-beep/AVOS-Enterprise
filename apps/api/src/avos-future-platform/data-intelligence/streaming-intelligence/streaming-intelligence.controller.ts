import { Controller, Get } from '@nestjs/common';
import { StreamingIntelligenceService } from './streaming-intelligence.service';

@Controller('avos/future/data-intelligence/streaming-intelligence')
export class StreamingIntelligenceController {
  constructor(private readonly service: StreamingIntelligenceService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}