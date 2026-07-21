import { Module } from '@nestjs/common';
import { ProductionDeploymentGoLiveController } from './production-deployment-go-live.controller';
import { ProductionDeploymentRuntimeService } from './production-deployment-runtime.service';
import { ProductionReadinessVerificationService } from './production-readiness-verification.service';
import { ProductionGoLiveCertificationService } from './production-go-live-certification.service';

@Module({
  controllers: [ProductionDeploymentGoLiveController],
  providers: [
    ProductionDeploymentRuntimeService,
    ProductionReadinessVerificationService,
    ProductionGoLiveCertificationService,
  ],
  exports: [
    ProductionDeploymentRuntimeService,
    ProductionReadinessVerificationService,
    ProductionGoLiveCertificationService,
  ],
})
export class ProductionDeploymentGoLiveModule {}
