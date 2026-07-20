import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CognitiveGovernanceService } from './cognitive-governance.service';
import { GovernanceDecisionInput } from './cognitive-governance.types';
import { LivingVisionGovernanceService } from './living-vision-governance.service';
import { OrganizationReadinessService } from './organization-readiness.service';
import { ThinkingConstitutionService } from './thinking-constitution.service';

@Controller('avos/platform-closure/pack-0-5')
export class CognitiveGovernanceController {
  constructor(
    private readonly governance: CognitiveGovernanceService,
    private readonly constitution: ThinkingConstitutionService,
    private readonly livingVision: LivingVisionGovernanceService,
    private readonly organizationReadiness: OrganizationReadinessService,
  ) {}

  @Get('status')
  status() {
    return this.governance.status();
  }

  @Get('constitution')
  constitutionRules() {
    return {
      validation: this.constitution.validate(),
      rules: this.constitution.list(),
    };
  }

  @Post('living-vision/link')
  linkLivingVision(
    @Body()
    body: {
      projectId: string;
      livingVisionId: string;
      linkedBy: string;
    },
  ) {
    return this.livingVision.linkProject(body);
  }

  @Get('living-vision/links')
  livingVisionLinks() {
    return this.livingVision.list();
  }

  @Get('organization-readiness')
  organizationStatus() {
    return this.organizationReadiness.status();
  }

  @Post('organization-readiness/approve')
  approveOrganizationOS(@Body() body: { approvedBy: string }) {
    return this.organizationReadiness.markOrganizationOSReady(body.approvedBy);
  }

  @Post('decisions')
  submitDecision(@Body() body: GovernanceDecisionInput) {
    return this.governance.submit(body);
  }

  @Get('decisions')
  listDecisions() {
    return this.governance.list();
  }

  @Get('decisions/:decisionId')
  getDecision(@Param('decisionId') decisionId: string) {
    return this.governance.get(decisionId);
  }

  @Post('decisions/:decisionId/human-approval')
  humanApproval(
    @Param('decisionId') decisionId: string,
    @Body()
    body: {
      approvedBy: string;
      action: 'approved' | 'rejected';
      reason?: string;
    },
  ) {
    return this.governance.humanDecision(decisionId, body);
  }
}