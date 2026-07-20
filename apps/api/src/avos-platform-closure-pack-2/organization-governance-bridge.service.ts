import { Injectable } from '@nestjs/common';
import { CognitiveGovernanceService } from '../avos-platform-closure-pack-0-5/cognitive-governance.service';
import { LivingVisionGovernanceService } from '../avos-platform-closure-pack-0-5/living-vision-governance.service';
import { OrganizationReadinessService } from '../avos-platform-closure-pack-0-5/organization-readiness.service';

@Injectable()
export class OrganizationGovernanceBridgeService {
  constructor(
    private readonly governance: CognitiveGovernanceService,
    private readonly livingVision: LivingVisionGovernanceService,
    private readonly readiness: OrganizationReadinessService,
  ) {}

  validateProject(projectId: string, livingVisionId: string): void {
    if (!this.livingVision.isLinked(projectId, livingVisionId)) {
      throw new Error(
        'Digital teams require an active project-to-Living-Vision link.',
      );
    }
  }

  approveOrganizationOS(approvedBy: string) {
    return this.readiness.markOrganizationOSReady(approvedBy);
  }

  readinessStatus() {
    return this.readiness.status();
  }

  createTeamGovernanceDecision(input: {
    projectId: string;
    livingVisionId: string;
    requestedBy: string;
    teamName: string;
  }) {
    return this.governance.submit({
      title: `Digital team formation: ${input.teamName}`,
      description:
        'Review organization structure, agent capability boundaries, and multi-agent activation.',
      type: 'architecture',
      projectId: input.projectId,
      livingVisionId: input.livingVisionId,
      requestedBy: input.requestedBy,
      riskLevel: 'high',
      strategicImpact: true,
      technicalSensitivity: true,
    });
  }
}