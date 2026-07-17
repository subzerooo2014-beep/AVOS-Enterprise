import { Controller, Get } from '@nestjs/common';
import { EnterpriseDigitalMemoryService } from './enterprise-digital-memory.service';

@Controller('avos/future/knowledge-memory/enterprise-digital-memory')
export class EnterpriseDigitalMemoryController {
  constructor(private readonly service: EnterpriseDigitalMemoryService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}