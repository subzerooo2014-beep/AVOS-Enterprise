import { Body, Controller, Get, Post } from '@nestjs/common';
import { EvaluateArchitectureDto } from './dto/evaluate-architecture.dto';
import { SynthesizeArchitectureDto } from './dto/synthesize-architecture.dto';
import { ArchitectureGenomeService } from './architecture-genome.service';
import { ArchitectureSynthesisService } from './architecture-synthesis.service';
import { SelfDesigningArchitectureService } from './self-designing-architecture.service';
import { ArchitectureIntelligenceDashboardService } from './architecture-intelligence-dashboard.service';
import { ARCHITECTURE_CAPABILITIES } from './architecture-governance.types';

@Controller('architecture-governance')
export class ArchitectureGovernanceController {
  constructor(
    private readonly genome: ArchitectureGenomeService,
    private readonly synthesis: ArchitectureSynthesisService,
    private readonly selfDesign: SelfDesigningArchitectureService,
    private readonly dashboard: ArchitectureIntelligenceDashboardService,
  ) {}

  @Get('capabilities')
  capabilities() {
    return {
      bundle: 'Ultra Bundle C — Architecture & Governance Evolution',
      count: ARCHITECTURE_CAPABILITIES.length,
      capabilities: ARCHITECTURE_CAPABILITIES,
    };
  }

  @Post('genome/evaluate')
  evaluate(@Body() input: EvaluateArchitectureDto) {
    return this.genome.generate(input.signals, input.constraints);
  }

  @Post('synthesis')
  synthesize(@Body() input: SynthesizeArchitectureDto) {
    return this.synthesis.synthesize(
      input.objective,
      input.targetCapabilities as never,
      input.currentFitness,
      input.constraints,
    );
  }

  @Post('self-design')
  selfDesignArchitecture(
    @Body()
    input: EvaluateArchitectureDto & { objective?: string },
  ) {
    return this.selfDesign.design(
      input.objective ?? 'continuous enterprise architecture improvement',
      input.signals,
      input.constraints,
    );
  }

  @Get('dashboard')
  dashboardSnapshot() {
    return this.dashboard.snapshot();
  }
}