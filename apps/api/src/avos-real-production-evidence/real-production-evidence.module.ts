import { Module } from '@nestjs/common';
import { RealProductionEvidenceController } from './real-production-evidence.controller';
import { RealProductionEvidenceService } from './real-production-evidence.service';

@Module({
  controllers: [
    RealProductionEvidenceController,
  ],
  providers: [
    RealProductionEvidenceService,
  ],
  exports: [
    RealProductionEvidenceService,
  ],
})
export class RealProductionEvidenceModule {}
