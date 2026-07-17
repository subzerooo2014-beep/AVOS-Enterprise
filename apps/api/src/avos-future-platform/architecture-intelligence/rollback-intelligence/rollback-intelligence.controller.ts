import { Controller, Get } from '@nestjs/common';
import { RollbackIntelligenceService } from './rollback-intelligence.service';

@Controller('avos/future/architecture-intelligence/rollback-intelligence')
export class RollbackIntelligenceController {
  constructor(private readonly service: RollbackIntelligenceService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}