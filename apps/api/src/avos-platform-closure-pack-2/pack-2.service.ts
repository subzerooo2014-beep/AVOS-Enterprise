import { Injectable } from '@nestjs/common';
import { AgentRegistryService } from './agent-registry.service';
import { CollaborationBusService } from './collaboration-bus.service';
import { ConsensusEngineService } from './consensus-engine.service';
import { Pack2Status } from './digital-organization.types';
import { TaskOrchestrationService } from './task-orchestration.service';
import { TeamRetrospectiveService } from './team-retrospective.service';
import { TeamRuntimeService } from './team-runtime.service';

@Injectable()
export class Pack2Service {
  constructor(
    private readonly agents: AgentRegistryService,
    private readonly teams: TeamRuntimeService,
    private readonly tasks: TaskOrchestrationService,
    private readonly bus: CollaborationBusService,
    private readonly consensus: ConsensusEngineService,
    private readonly retrospectives: TeamRetrospectiveService,
  ) {}

  status(): Pack2Status {
    const agents = this.agents.list();
    const teams = this.teams.list();
    const tasks = this.tasks.list();
    const consensus = this.consensus.list();
    const retrospectives = this.retrospectives.list();

    return {
      name: 'AVOS Digital Organization & Multi-Agent Runtime',
      version: 'PC-P2-1.0.0',
      status: 'operational',
      layer: 'Digital Organization & Multi-Agent Runtime',
      metrics: {
        agents: agents.length,
        certifiedAgents: agents.filter((agent) => agent.certified).length,
        teams: teams.length,
        activeTeams: teams.filter((team) => team.status === 'active').length,
        tasks: tasks.length,
        completedTasks: tasks.filter((task) => task.status === 'completed').length,
        messages: this.bus.list().length,
        consensusRecords: consensus.length,
        humanEscalations:
          consensus.filter((item) => item.status === 'human-escalation').length +
          tasks.filter((task) => task.humanEscalationRequired).length,
        retrospectives: retrospectives.length,
      },
      controls: {
        organizationOS: true,
        humanFinalAuthority: true,
        certifiedAgentsOnly: true,
        capabilityBasedAssignment: true,
        secureInterAgentPermissions: true,
        sharedWorkingMemory: true,
        consensusAndConflictResolution: true,
        humanEscalation: true,
        teamRetrospectiveRequired: true,
        livingVisionAlignment: true,
      },
    };
  }
}