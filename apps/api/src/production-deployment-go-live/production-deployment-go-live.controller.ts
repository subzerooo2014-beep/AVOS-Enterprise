import { Body, Controller, Get, Post } from '@nestjs/common';
import { ProductionDeploymentRuntimeService } from './production-deployment-runtime.service';
import { ProductionReadinessVerificationService } from './production-readiness-verification.service';
import { ProductionGoLiveCertificationService } from './production-go-live-certification.service';
import { ProductionCertificationRequest } from './production-deployment-go-live.types';

@Controller('avos/production-deployment')
export class ProductionDeploymentGoLiveController {
  constructor(
    private readonly runtime: ProductionDeploymentRuntimeService,
    private readonly verification: ProductionReadinessVerificationService,
    private readonly certification: ProductionGoLiveCertificationService,
  ) {}

  @Get('status')
  status() {
    return this.runtime.getStatus();
  }

  @Get('health')
  health() {
    return this.runtime.getHealth();
  }

  @Post('verify')
  verify() {
    return this.verification.verify();
  }

  @Post('certification/certify')
  certify(@Body() request: ProductionCertificationRequest) {
    return this.certification.certify(request);
  }
}
