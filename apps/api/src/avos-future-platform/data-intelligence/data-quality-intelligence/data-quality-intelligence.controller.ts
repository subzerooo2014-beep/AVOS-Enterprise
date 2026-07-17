import { Controller, Get } from '@nestjs/common';
import { DataQualityIntelligenceService } from './data-quality-intelligence.service';

@Controller('avos/future/data-intelligence/data-quality-intelligence')
export class DataQualityIntelligenceController {
  constructor(private readonly service: DataQualityIntelligenceService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}