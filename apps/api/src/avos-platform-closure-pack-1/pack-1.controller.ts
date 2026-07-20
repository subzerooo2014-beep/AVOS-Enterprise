import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { LearningEngineService } from './learning-engine.service';
import {
  LearningProposalInput,
  LivingMemoryRecordInput,
  ProjectRetrospectiveInput,
} from './learning-memory.types';
import { LivingMemoryService } from './living-memory.service';
import { Pack1Service } from './pack-1.service';
import { ProjectRetrospectiveService } from './project-retrospective.service';

@Controller('avos/platform-closure/pack-1')
export class Pack1Controller {
  constructor(
    private readonly pack: Pack1Service,
    private readonly memory: LivingMemoryService,
    private readonly learning: LearningEngineService,
    private readonly retrospectives: ProjectRetrospectiveService,
  ) {}

  @Get('status')
  status() {
    return this.pack.status();
  }

  @Post('memory')
  captureMemory(@Body() body: LivingMemoryRecordInput) {
    return this.memory.capture(body);
  }

  @Get('memory')
  listMemory() {
    return this.memory.list();
  }

  @Get('memory/approved')
  approvedMemory() {
    return this.memory.approved();
  }

  @Get('memory/:id')
  getMemory(@Param('id') id: string) {
    return this.memory.get(id);
  }

  @Post('memory/:id/human-approval')
  approveMemory(
    @Param('id') id: string,
    @Body()
    body: {
      approvedBy: string;
      action: 'approved' | 'rejected';
      reason?: string;
    },
  ) {
    return this.memory.approve(id, body);
  }

  @Post('learning/proposals')
  proposeLearning(@Body() body: LearningProposalInput) {
    return this.learning.propose(body);
  }

  @Get('learning/proposals')
  listLearningProposals() {
    return this.learning.list();
  }

  @Get('learning/proposals/:id')
  getLearningProposal(@Param('id') id: string) {
    return this.learning.get(id);
  }

  @Post('learning/proposals/:id/human-approval')
  approveLearning(
    @Param('id') id: string,
    @Body()
    body: {
      approvedBy: string;
      action: 'approved' | 'rejected';
    },
  ) {
    return this.learning.approve(id, body);
  }

  @Post('retrospectives')
  publishRetrospective(@Body() body: ProjectRetrospectiveInput) {
    return this.retrospectives.publish(body);
  }

  @Get('retrospectives')
  listRetrospectives() {
    return this.retrospectives.list();
  }
}