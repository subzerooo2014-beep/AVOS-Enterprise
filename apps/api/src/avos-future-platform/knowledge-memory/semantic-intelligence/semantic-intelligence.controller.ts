import { Controller, Get } from '@nestjs/common';
import { SemanticIntelligenceService } from './semantic-intelligence.service';

@Controller('avos/future/knowledge-memory/semantic-intelligence')
export class SemanticIntelligenceController {
  constructor(private readonly service: SemanticIntelligenceService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}