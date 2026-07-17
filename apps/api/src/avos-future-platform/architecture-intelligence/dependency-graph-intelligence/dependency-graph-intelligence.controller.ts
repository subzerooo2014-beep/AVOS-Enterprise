import { Controller, Get } from '@nestjs/common';
import { DependencyGraphIntelligenceService } from './dependency-graph-intelligence.service';

@Controller('avos/future/architecture-intelligence/dependency-graph-intelligence')
export class DependencyGraphIntelligenceController {
  constructor(private readonly service: DependencyGraphIntelligenceService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}