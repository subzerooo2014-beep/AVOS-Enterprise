import { Controller, Get } from '@nestjs/common';
import { OperationalMemoryService } from './operational-memory.service';

@Controller('avos/future/knowledge-memory/operational-memory')
export class OperationalMemoryController {
  constructor(private readonly service: OperationalMemoryService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}