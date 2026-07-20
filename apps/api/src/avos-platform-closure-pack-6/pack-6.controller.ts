import { Body, Controller, Get, Post } from '@nestjs/common';
import { PlatformCertificationService } from './platform-certification.service';
import { PlatformClosureReviewService } from './platform-closure-review.service';
import { Pack6Service } from './pack-6.service';
import { ProductionReadinessService } from './production-readiness.service';

@Controller('avos/platform-closure/pack-6')
export class Pack6Controller {
  constructor(
    private readonly pack: Pack6Service,
    private readonly review: PlatformClosureReviewService,
    private readonly readiness: ProductionReadinessService,
    private readonly certification: PlatformCertificationService,
  ) {}

  @Get('status')
  status() {
    return this.pack.status();
  }

  @Post('review')
  runReview() {
    return this.review.run();
  }

  @Get('review/latest')
  latestReview() {
    return this.review.getLatest() ?? null;
  }

  @Post('production-readiness')
  runProductionReadiness() {
    return this.readiness.assess();
  }

  @Get('production-readiness/latest')
  latestProductionReadiness() {
    return this.readiness.getLatest() ?? null;
  }

  @Post('certification/certify')
  certify(@Body() body: { approvedBy: string }) {
    return this.certification.certify(body.approvedBy);
  }

  @Get('certification/latest')
  latestCertification() {
    return this.certification.getLatest() ?? null;
  }

  @Get('certification/history')
  certificationHistory() {
    return this.certification.list();
  }
}