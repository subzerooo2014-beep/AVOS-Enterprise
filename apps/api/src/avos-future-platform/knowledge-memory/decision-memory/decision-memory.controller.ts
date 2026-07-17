import { Controller, Get } from '@nestjs/common';
import { DecisionMemoryService } from './decision-memory.service';

@Controller('avos/future/knowledge-memory/decision-memory')
export class DecisionMemoryController {
  constructor(private readonly service: DecisionMemoryService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}