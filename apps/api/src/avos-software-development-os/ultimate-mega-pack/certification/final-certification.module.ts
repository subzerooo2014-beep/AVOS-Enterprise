import { Module } from '@nestjs/common';
import { FinalCertificationService } from './final-certification.service';

@Module({
  providers: [FinalCertificationService],
  exports: [FinalCertificationService],
})
export class FinalCertificationModule {}
