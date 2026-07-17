import { Controller, Get } from '@nestjs/common';
import { CompatibilityIntelligenceService } from './compatibility-intelligence.service';

@Controller('avos/future/architecture-intelligence/compatibility-intelligence')
export class CompatibilityIntelligenceController {
  constructor(private readonly service: CompatibilityIntelligenceService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}