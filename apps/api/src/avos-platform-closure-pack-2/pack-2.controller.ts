import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { AgentRegistryService } from './agent-registry.service';
import { CollaborationBusService } from './collaboration-bus.service';
import { ConsensusEngineService } from './consensus-engine.service';
import {
  AgentDefinitionInput,
  ConsensusInput,
  OrganizationTaskInput,
  TeamFormationInput,
  TeamRetrospectiveInput,
} from './digital-organization.types';
import { OrganizationGovernanceBridgeService } from './organization-governance-bridge.service';
import { Pack2Service } from './pack-2.service';
import { TaskOrchestrationService } from './task-orchestration.service';
import { TeamRetrospectiveService } from './team-retrospective.service';
import { TeamRuntimeService } from './team-runtime.service';

@Controller('avos/platform-closure/pack-2')
export class Pack2Controller {
  constructor(
    private readonly pack: Pack2Service,
    private readonly agents: AgentRegistryService,
    private readonly teams: TeamRuntimeService,
    private readonly tasks: TaskOrchestrationService,
    private readonly bus: CollaborationBusService,
    private readonly consensus: ConsensusEngineService,
    private readonly retrospectives: TeamRetrospectiveService,
    private readonly governance: OrganizationGovernanceBridgeService,
  ) {}

  @Get('status')
  status() {
    return this.pack.status();
  }

  @Post('organization-os/approve')
  approveOrganizationOS(@Body() body: { approvedBy: string }) {
    return this.governance.approveOrganizationOS(body.approvedBy);
  }

  @Get('organization-os/readiness')
  readiness() {
    return this.governance.readinessStatus();
  }

  @Post('agents')
  registerAgent(@Body() body: AgentDefinitionInput) {
    return this.agents.register(body);
  }

  @Get('agents')
  listAgents() {
    return this.agents.list();
  }

  @Post('agents/:id/certify')
  certifyAgent(
    @Param('id') id: string,
    @Body() body: { approvedBy: string },
  ) {
    return this.agents.certify(id, body.approvedBy);
  }

  @Post('teams')
  formTeam(@Body() body: TeamFormationInput) {
    return this.teams.form(body);
  }

  @Get('teams')
  listTeams() {
    return this.teams.list();
  }

  @Post('teams/:id/human-approval')
  approveTeam(
    @Param('id') id: string,
    @Body()
    body: {
      approvedBy: string;
      action: 'approved' | 'rejected';
    },
  ) {
    return this.teams.approve(id, body);
  }

  @Post('tasks')
  createTask(@Body() body: OrganizationTaskInput) {
    return this.tasks.create(body);
  }

  @Get('tasks')
  listTasks() {
    return this.tasks.list();
  }

  @Post('tasks/:id/escalation-approval')
  approveTaskEscalation(
    @Param('id') id: string,
    @Body() body: { approvedBy: string },
  ) {
    return this.tasks.approveEscalatedTask(id, body.approvedBy);
  }

  @Post('tasks/:id/complete')
  completeTask(@Param('id') id: string) {
    return this.tasks.complete(id);
  }

  @Post('messages')
  publishMessage(
    @Body()
    body: {
      fromAgentId: string;
      toAgentId?: string;
      teamId: string;
      type: 'request' | 'response' | 'decision' | 'evidence' | 'escalation';
      content: string;
    },
  ) {
    return this.bus.publish(body);
  }

  @Get('messages')
  listMessages(@Query('teamId') teamId?: string) {
    return this.bus.list(teamId);
  }

  @Post('consensus')
  evaluateConsensus(@Body() body: ConsensusInput) {
    return this.consensus.evaluate(body);
  }

  @Get('consensus')
  listConsensus() {
    return this.consensus.list();
  }

  @Post('retrospectives')
  publishRetrospective(@Body() body: TeamRetrospectiveInput) {
    return this.retrospectives.publish(body);
  }

  @Get('retrospectives')
  listRetrospectives() {
    return this.retrospectives.list();
  }
}