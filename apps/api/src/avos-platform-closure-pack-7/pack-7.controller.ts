import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { EvolutionGovernanceService } from './evolution-governance.service';
import { EvolutionProposalInput } from './evolution-runtime.types';
import { Pack7Service } from './pack-7.service';

@Controller('avos/platform-closure/pack-7')
export class Pack7Controller {
  constructor(
    private readonly pack: Pack7Service,
    private readonly evolution: EvolutionGovernanceService,
  ) {}

  @Get('status')
  status() {
    return this.pack.status();
  }

  @Post('proposals')
  createProposal(@Body() body: EvolutionProposalInput) {
    return this.evolution.create(body);
  }

  @Get('proposals')
  listProposals() {
    return this.evolution.listProposals();
  }

  @Post('proposals/:id/human-approval')
  approveProposal(
    @Param('id') id: string,
    @Body()
    body: {
      approvedBy: string;
      action: 'approved' | 'rejected';
    },
  ) {
    return this.evolution.approve(id, body);
  }

  @Post('proposals/:id/upgrade-plan')
  createUpgradePlan(
    @Param('id') id: string,
    @Body()
    body: {
      steps: string[];
      rollbackPlan: string[];
      validationChecks: string[];
      createdBy: string;
    },
  ) {
    return this.evolution.createPlan(id, body);
  }

  @Post('upgrade-plans/:id/human-approval')
  approveUpgradePlan(
    @Param('id') id: string,
    @Body() body: { approvedBy: string },
  ) {
    return this.evolution.approvePlan(id, body.approvedBy);
  }

  @Post('upgrade-plans/:id/complete')
  completeUpgradePlan(
    @Param('id') id: string,
    @Body() body: { completedBy: string },
  ) {
    return this.evolution.completePlan(id, body.completedBy);
  }

  @Post('proposals/:id/rollback')
  rollbackProposal(
    @Param('id') id: string,
    @Body() body: { approvedBy: string },
  ) {
    return this.evolution.rollbackProposal(id, body.approvedBy);
  }

  @Get('upgrade-plans')
  listUpgradePlans() {
    return this.evolution.listPlans();
  }

  @Get('audit')
  listAudit() {
    return this.evolution.listAudit();
  }
}