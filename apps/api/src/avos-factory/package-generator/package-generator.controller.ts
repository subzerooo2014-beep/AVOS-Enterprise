import { Body, Controller, Get, Post } from '@nestjs/common';
import { PackageGeneratorCertification, PackageGeneratorExecutionResult, PackageGeneratorRequest } from './contracts/package-generator.contracts';
import { PackageGeneratorOrchestratorService } from './package-generator-orchestrator.service';

@Controller('avos/factory/package-generator')
export class PackageGeneratorController {
  constructor(private readonly orchestrator: PackageGeneratorOrchestratorService) {}

  @Get('status')
  status(): Record<string, unknown> {
    return this.orchestrator.status();
  }

  @Get('executions')
  executions(): Record<string, unknown> {
    return this.orchestrator.list();
  }

  @Post('generate')
  generate(@Body() body: PackageGeneratorRequest): Promise<PackageGeneratorExecutionResult> {
    return this.orchestrator.generate(body);
  }

  @Post('generate/aeos-mega-pack-2')
  generateAeosMegaPack2(
    @Body() body: { repoRoot?: string },
  ): Promise<Record<string, unknown>> {
    return this.orchestrator.generateAeosMegaPack2(body.repoRoot ?? process.cwd());
  }

  @Post('certification/certify')
  certify(
    @Body() body: { executionId: string; approvedBy: string },
  ): PackageGeneratorCertification {
    return this.orchestrator.certify(body.executionId, body.approvedBy);
  }
}
