import { Controller, Get } from '@nestjs/common';
import { InnovationMemoryService } from './innovation-memory.service';

@Controller('avos/future/knowledge-memory/innovation-memory')
export class InnovationMemoryController {
  constructor(private readonly service: InnovationMemoryService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}