import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { EvidenceRegistryService } from './evidence-registry.service';
import {
  EvidenceInput,
  KnowledgeQueryInput,
  ResearchRequestInput,
} from './knowledge-runtime.types';
import { KnowledgeQueryService } from './knowledge-query.service';
import { Pack4Service } from './pack-4.service';
import { ResearchOrchestratorService } from './research-orchestrator.service';

@Controller('avos/platform-closure/pack-4')
export class Pack4Controller {
  constructor(
    private readonly pack: Pack4Service,
    private readonly evidence: EvidenceRegistryService,
    private readonly research: ResearchOrchestratorService,
    private readonly queries: KnowledgeQueryService,
  ) {}

  @Get('status')
  status() {
    return this.pack.status();
  }

  @Post('evidence')
  captureEvidence(@Body() body: EvidenceInput) {
    return this.evidence.capture(body);
  }

  @Get('evidence')
  listEvidence() {
    return this.evidence.list();
  }

  @Get('evidence/:id')
  getEvidence(@Param('id') id: string) {
    return this.evidence.get(id);
  }

  @Post('evidence/:id/validate')
  validateEvidence(@Param('id') id: string) {
    return this.evidence.validate(id);
  }

  @Post('evidence/:id/approve')
  approveEvidence(
    @Param('id') id: string,
    @Body() body: { approvedBy: string },
  ) {
    return this.evidence.approve(id, body.approvedBy);
  }

  @Post('evidence/:id/supersede/:replacementId')
  supersedeEvidence(
    @Param('id') id: string,
    @Param('replacementId') replacementId: string,
    @Body() body: { approvedBy: string },
  ) {
    return this.evidence.supersede(
      id,
      replacementId,
      body.approvedBy,
    );
  }

  @Post('knowledge/query')
  queryKnowledge(@Body() body: KnowledgeQueryInput) {
    return this.queries.search(body);
  }

  @Post('research')
  createResearch(@Body() body: ResearchRequestInput) {
    return this.research.create(body);
  }

  @Get('research')
  listResearch() {
    return this.research.list();
  }

  @Get('research/:id')
  getResearch(@Param('id') id: string) {
    return this.research.get(id);
  }

  @Post('research/:id/evidence/:evidenceId')
  attachEvidence(
    @Param('id') id: string,
    @Param('evidenceId') evidenceId: string,
  ) {
    return this.research.attachEvidence(id, evidenceId);
  }

  @Post('research/:id/conclude')
  concludeResearch(
    @Param('id') id: string,
    @Body() body: { conclusion: string },
  ) {
    return this.research.conclude(id, body.conclusion);
  }

  @Post('research/:id/human-approval')
  approveResearch(
    @Param('id') id: string,
    @Body()
    body: {
      approvedBy: string;
      action: 'approved' | 'rejected';
    },
  ) {
    return this.research.approve(id, body);
  }

  @Post('research/:id/publish')
  publishResearch(@Param('id') id: string) {
    return this.research.publish(id);
  }
}