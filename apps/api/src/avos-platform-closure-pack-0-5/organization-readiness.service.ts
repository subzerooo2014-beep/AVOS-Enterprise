import { Injectable } from '@nestjs/common';

@Injectable()
export class OrganizationReadinessService {
  private organizationOSReady = false;
  private aiCouncilReady = true;

  status() {
    return {
      organizationOSReady: this.organizationOSReady,
      aiCouncilReady: this.aiCouncilReady,
      multiAgentAllowed: this.organizationOSReady && this.aiCouncilReady,
    };
  }

  markOrganizationOSReady(approvedBy: string) {
    if (!approvedBy.toLowerCase().startsWith('human:')) {
      throw new Error('Organization OS readiness requires Human Final Authority approval.');
    }

    this.organizationOSReady = true;
    return this.status();
  }
}