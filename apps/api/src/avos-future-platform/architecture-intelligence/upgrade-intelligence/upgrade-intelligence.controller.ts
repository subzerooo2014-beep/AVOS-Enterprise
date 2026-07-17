import { Controller, Get } from '@nestjs/common';
import { UpgradeIntelligenceService } from './upgrade-intelligence.service';

@Controller('avos/future/architecture-intelligence/upgrade-intelligence')
export class UpgradeIntelligenceController {
  constructor(private readonly service: UpgradeIntelligenceService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}