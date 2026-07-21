import { Module } from '@nestjs/common';
import { MultiAgentSoftwareOrganizationService } from './multi-agent-software-organization.service';

@Module({
  providers: [MultiAgentSoftwareOrganizationService],
  exports: [MultiAgentSoftwareOrganizationService],
})
export class MultiAgentSoftwareOrganizationModule {}
