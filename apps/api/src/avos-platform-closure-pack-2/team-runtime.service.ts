import { Injectable, NotFoundException } from '@nestjs/common';
import { AgentRegistryService } from './agent-registry.service';
import {
  DigitalTeam,
  TeamFormationInput,
} from './digital-organization.types';
import { OrganizationGovernanceBridgeService } from './organization-governance-bridge.service';

@Injectable()
export class TeamRuntimeService {
  private readonly teams = new Map<string, DigitalTeam>();

  constructor(
    private readonly agents: AgentRegistryService,
    private readonly governance: OrganizationGovernanceBridgeService,
  ) {}

  form(input: TeamFormationInput): DigitalTeam {
    this.governance.validateProject(input.projectId, input.livingVisionId);

    const readiness = this.governance.readinessStatus();

    if (!readiness.multiAgentAllowed) {
      throw new Error(
        'Organization OS and AI Council must be ready before team formation.',
      );
    }

    const selectedAgentIds = new Set<string>();

    for (const capability of input.requiredCapabilities) {
      const candidates = this.agents.findCertifiedByCapability(capability);

      if (candidates.length === 0) {
        throw new Error(
          `No certified active agent provides required capability: ${capability}`,
        );
      }

      selectedAgentIds.add(candidates[0].id);
    }

    const now = new Date().toISOString();
    const team: DigitalTeam = {
      id: `digital-team-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name: input.name,
      purpose: input.purpose,
      projectId: input.projectId,
      livingVisionId: input.livingVisionId,
      requiredCapabilities: [...new Set(input.requiredCapabilities)],
      agentIds: [...selectedAgentIds],
      status: 'forming',
      requiresHumanApproval: true,
      createdAt: now,
      updatedAt: now,
    };

    const governanceDecision = this.governance.createTeamGovernanceDecision({
      projectId: input.projectId,
      livingVisionId: input.livingVisionId,
      requestedBy: input.requestedBy,
      teamName: input.name,
    });

    if (governanceDecision.status === 'blocked') {
      team.status = 'blocked';
    }

    this.teams.set(team.id, team);
    return this.clone(team);
  }

  approve(
    id: string,
    input: { approvedBy: string; action: 'approved' | 'rejected' },
  ): DigitalTeam {
    const team = this.require(id);

    if (!input.approvedBy.toLowerCase().startsWith('human:')) {
      throw new Error('Team activation requires Human Final Authority.');
    }

    team.status = input.action === 'approved' ? 'active' : 'blocked';
    team.approvedBy = input.approvedBy;
    team.updatedAt = new Date().toISOString();

    return this.clone(team);
  }

  require(id: string): DigitalTeam {
    const team = this.teams.get(id);

    if (!team) {
      throw new NotFoundException(`Team ${id} was not found.`);
    }

    return team;
  }

  list(): DigitalTeam[] {
    return [...this.teams.values()].map((team) => this.clone(team));
  }

  get(id: string): DigitalTeam {
    return this.clone(this.require(id));
  }

  private clone(team: DigitalTeam): DigitalTeam {
    return JSON.parse(JSON.stringify(team)) as DigitalTeam;
  }
}