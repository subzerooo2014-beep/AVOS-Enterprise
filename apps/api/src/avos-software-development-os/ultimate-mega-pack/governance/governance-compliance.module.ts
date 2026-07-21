import { Module } from '@nestjs/common';
import { GovernanceComplianceService } from './governance-compliance.service';

@Module({
  providers: [GovernanceComplianceService],
  exports: [GovernanceComplianceService],
})
export class GovernanceComplianceModule {}
