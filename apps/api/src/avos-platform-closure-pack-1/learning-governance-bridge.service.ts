import { Injectable } from '@nestjs/common';
import { CognitiveGovernanceService } from '../avos-platform-closure-pack-0-5/cognitive-governance.service';
import { LivingVisionGovernanceService } from '../avos-platform-closure-pack-0-5/living-vision-governance.service';

@Injectable()
export class LearningGovernanceBridgeService {
  constructor(
    private readonly governance: CognitiveGovernanceService,
    private readonly livingVision: LivingVisionGovernanceService,
  ) {}

  validateLivingVision(projectId: string, livingVisionId: string): void {
    if (!this.livingVision.isLinked(projectId, livingVisionId)) {
      throw new Error(
        'Learning requires an active project-to-Living-Vision governance link.',
      );
    }
  }

  createGovernanceDecision(input: {
    projectId: string;
    livingVisionId: string;
    title: string;
    requestedBy: string;
    riskLevel: 'low' | 'medium' | 'high' | 'critical';
    description: string;
  }) {
    this.validateLivingVision(input.projectId, input.livingVisionId);

    return this.governance.submit({
      title: input.title,
      description: input.description,
      type: 'architecture',
      projectId: input.projectId,
      livingVisionId: input.livingVisionId,
      requestedBy: input.requestedBy,
      riskLevel: input.riskLevel,
      strategicImpact: true,
      technicalSensitivity: input.riskLevel === 'high' || input.riskLevel === 'critical',
    });
  }
}