import { Controller, Get, Post } from '@nestjs/common';
import { FoundationFinalCompletionService } from './foundation-final-completion.service';

@Controller('foundation-final-completion')
export class FoundationFinalCompletionController {
  constructor(
    private readonly foundationFinalCompletion: FoundationFinalCompletionService,
  ) {}

  @Get('status')
  status() {
    return this.foundationFinalCompletion.getStatus();
  }

  @Get('registry')
  registry() {
    return this.foundationFinalCompletion.getRegistry();
  }

  @Post('verify')
  verify() {
    return this.foundationFinalCompletion.runVerification();
  }

  @Post('certify')
  certify() {
    return this.foundationFinalCompletion.runCertification();
  }

  @Get('health')
  health() {
    const report = this.foundationFinalCompletion.runVerification();

    return {
      status: report.status,
      score: report.score,
      healthy: report.status === 'healthy',
      timestamp: report.generatedAt,
    };
  }
}
