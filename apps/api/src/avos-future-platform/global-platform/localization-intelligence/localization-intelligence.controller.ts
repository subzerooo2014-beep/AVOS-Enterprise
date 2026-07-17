import { Controller, Get } from '@nestjs/common';
import { LocalizationIntelligenceService } from './localization-intelligence.service';

@Controller('avos/future/global-platform/localization-intelligence')
export class LocalizationIntelligenceController {
  constructor(private readonly service: LocalizationIntelligenceService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}