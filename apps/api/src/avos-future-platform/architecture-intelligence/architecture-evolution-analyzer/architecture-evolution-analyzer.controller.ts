import { Controller, Get } from '@nestjs/common';
import { ArchitectureEvolutionAnalyzerService } from './architecture-evolution-analyzer.service';

@Controller('avos/future/architecture-intelligence/architecture-evolution-analyzer')
export class ArchitectureEvolutionAnalyzerController {
  constructor(private readonly service: ArchitectureEvolutionAnalyzerService) {}

  @Get('status')
  status() {
    return this.service.getStatus();
  }

  @Get('verify')
  verify() {
    return this.service.verify();
  }
}