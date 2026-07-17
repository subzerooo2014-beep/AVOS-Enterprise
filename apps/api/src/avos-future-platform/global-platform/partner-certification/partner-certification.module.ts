import { Module } from '@nestjs/common';
import { PartnerCertificationController } from './partner-certification.controller';
import { PartnerCertificationService } from './partner-certification.service';

@Module({
  controllers: [PartnerCertificationController],
  providers: [PartnerCertificationService],
  exports: [PartnerCertificationService],
})
export class PartnerCertificationModule {}