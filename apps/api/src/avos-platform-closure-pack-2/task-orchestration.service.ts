import { Injectable, NotFoundException } from '@nestjs/common';
import { AgentRegistryService } from './agent-registry.service';
import {
  OrganizationTask,
  OrganizationTaskInput,
} from './digital-organization.types';
import { TeamRuntimeService } from './team-runtime.service';

@Injectable()
export class TaskOrchestrationService {
  private readonly tasks = new Map<string, OrganizationTask>();

  constructor(
    private readonly teams: TeamRuntimeService,
    private readonly agents: AgentRegistryService,
  ) {}

  create(input: OrganizationTaskInput): OrganizationTask {
    const team = this.teams.require(input.teamId);

    if (team.status !== 'active') {
      throw new Error('Tasks may only be created for active teams.');
    }

    const candidates = team.agentIds
      .map((agentId) => this.agents.get(agentId))
      .filter(
        (agent) =>
          agent.certified &&
          agent.capabilities.includes(input.requiredCapability),
      );

    if (candidates.length === 0) {
      throw new Error(
        `No team agent provides capability ${input.requiredCapability}.`,
      );
    }

    const sensitive = input.sensitive ?? false;
    const strategic = input.strategic ?? false;
    const now = new Date().toISOString();

    const task: OrganizationTask = {
      id: `organization-task-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,
      teamId: input.teamId,
      title: input.title,
      description: input.description,
      requiredCapability: input.requiredCapability,
      assignedAgentId: candidates[0].id,
      sensitive,
      strategic,
      status: sensitive || strategic ? 'blocked' : 'assigned',
      humanEscalationRequired: sensitive || strategic,
      createdAt: now,
      updatedAt: now,
    };

    this.tasks.set(task.id, task);
    return this.clone(task);
  }

  approveEscalatedTask(
    id: string,
    approvedBy: string,
  ): OrganizationTask {
    const task = this.require(id);

    if (!approvedBy.toLowerCase().startsWith('human:')) {
      throw new Error('Task escalation approval requires human authority.');
    }

    task.status = 'assigned';
    task.humanEscalationRequired = false;
    task.updatedAt = new Date().toISOString();

    return this.clone(task);
  }

  complete(id: string): OrganizationTask {
    const task = this.require(id);

    if (task.status !== 'assigned' && task.status !== 'in-progress') {
      throw new Error('Only assigned or in-progress tasks can be completed.');
    }

    task.status = 'completed';
    task.updatedAt = new Date().toISOString();

    return this.clone(task);
  }

  require(id: string): OrganizationTask {
    const task = this.tasks.get(id);

    if (!task) {
      throw new NotFoundException(`Task ${id} was not found.`);
    }

    return task;
  }

  list(): OrganizationTask[] {
    return [...this.tasks.values()].map((task) => this.clone(task));
  }

  private clone(task: OrganizationTask): OrganizationTask {
    return JSON.parse(JSON.stringify(task)) as OrganizationTask;
  }
}