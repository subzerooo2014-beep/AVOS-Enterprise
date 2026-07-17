import { Controller, Get } from '@nestjs/common';
import { LongTermMemoryService } from './long-term-memory.service';

@Controller('avos/future/knowledge-memory/long-term-memory')
export class LongTermMemoryController {
  constructor(private readonly service: LongTermMemoryService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}