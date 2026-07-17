import { Module } from '@nestjs/common';
import { GovernanceCertificationCenterController } from './governance-certification-center.controller';
import { GovernanceCertificationCenterService } from './governance-certification-center.service';

@Module({
  controllers: [GovernanceCertificationCenterController],
  providers: [GovernanceCertificationCenterService],
  exports: [GovernanceCertificationCenterService],
})
export class GovernanceCertificationCenterModule {}