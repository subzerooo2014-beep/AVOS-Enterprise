import { Controller, Get } from '@nestjs/common';
import { ArchitectureIntelligenceEngineService } from './architecture-intelligence-engine.service';

@Controller('avos/future/architecture-intelligence/architecture-intelligence-engine')
export class ArchitectureIntelligenceEngineController {
  constructor(private readonly service: ArchitectureIntelligenceEngineService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}