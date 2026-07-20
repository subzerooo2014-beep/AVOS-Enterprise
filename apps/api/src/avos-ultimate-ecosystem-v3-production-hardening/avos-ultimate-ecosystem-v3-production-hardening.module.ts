import { Module } from '@nestjs/common';
import { AvosUltimateEcosystemV3Module } from '../avos-ultimate-ecosystem-v3/avos-ultimate-ecosystem-v3.module';
import { ProductionHardeningCertificationService } from './certification/production-hardening-certification.service';
import { ProductionHardeningController } from './production-hardening.controller';
import { ProductionHardeningHealthService } from './health/production-hardening-health.service';
import { ProductionRuntimeRegistryService } from './runtime/production-runtime-registry.service';
import { ProductionHardeningValidatorService } from './validation/production-hardening-validator.service';
import { EcosystemV3ArchitectureReviewService } from "../avos-ultimate-ecosystem-v3/review/ecosystem-v3-architecture-review.service";
@Module({
    imports: [AvosUltimateEcosystemV3Module],
    controllers: [ProductionHardeningController],
    providers: [
        ProductionRuntimeRegistryService,
        ProductionHardeningValidatorService,
        ProductionHardeningHealthService,
        ProductionHardeningCertificationService,
        EcosystemV3ArchitectureReviewService
    ],
    exports: [
        ProductionRuntimeRegistryService,
        ProductionHardeningValidatorService,
        ProductionHardeningHealthService,
        ProductionHardeningCertificationService,
    ]
})
export class AvosUltimateEcosystemV3ProductionHardeningModule {
}
