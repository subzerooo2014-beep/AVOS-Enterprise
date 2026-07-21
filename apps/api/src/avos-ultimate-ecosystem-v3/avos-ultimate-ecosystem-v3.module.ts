import { Module } from '@nestjs/common';
import { EcosystemV3ArchitectureReviewService } from './review/ecosystem-v3-architecture-review.service';

@Module({
  providers: [EcosystemV3ArchitectureReviewService],
  exports: [EcosystemV3ArchitectureReviewService],
})
export class AvosUltimateEcosystemV3Module {}