import { Injectable, NotFoundException } from '@nestjs/common';
import { AgentRegistryService } from '../avos-platform-closure-pack-2/agent-registry.service';
import { TeamRuntimeService } from '../avos-platform-closure-pack-2/team-runtime.service';
import { CheckpointEngineService } from './checkpoint-engine.service';
import { ExecutionEventBusService } from './execution-event-bus.service';
import {
  Workflow,
  WorkflowCreateInput,
  WorkflowStep,
} from './execution-runtime.types';
import { GoalDecompositionService } from './goal-decomposition.service';

@Injectable()
export class WorkflowRuntimeService {
  private readonly workflows = new Map<string, Workflow>();

  constructor(
    private readonly teams: TeamRuntimeService,
    private readonly agents: AgentRegistryService,
    private readonly decomposition: GoalDecompositionService,
    private readonly checkpoints: CheckpointEngineService,
    private readonly events: ExecutionEventBusService,
  ) {}

  create(input: WorkflowCreateInput): Workflow {
    const team = this.teams.require(input.teamId);

    if (team.status !== 'active') {
      throw new Error('Workflow creation requires an active digital team.');
    }

    if (
      team.projectId !== input.projectId ||
      team.livingVisionId !== input.livingVisionId
    ) {
      throw new Error('Workflow must match the team project and Living Vision.');
    }

    const definitions =
      input.steps && input.steps.length > 0
        ? input.steps
        : this.decomposition.decompose(input.goal);

    const idsByName = new Map<string, string>();

    for (const step of definitions) {
      idsByName.set(
        step.name,
        `workflow-step-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      );
    }

    const steps: WorkflowStep[] = definitions.map((definition) => {
      const candidates = team.agentIds
        .map((agentId) => this.agents.get(agentId))
        .filter(
          (agent) =>
            agent.certified &&
            agent.status === 'active' &&
            agent.capabilities.includes(definition.capability),
        );

      if (candidates.length === 0) {
        throw new Error(
          `No certified team agent provides capability ${definition.capability}.`,
        );
      }

      return {
        id: idsByName.get(definition.name)!,
        name: definition.name,
        capability: definition.capability,
        description: definition.description,
        dependsOn: (definition.dependsOn ?? []).map(
          (dependency) => idsByName.get(dependency) ?? dependency,
        ),
        assignedAgentId: candidates[0].id,
        status: 'pending',
        requiresHumanApproval: definition.requiresHumanApproval ?? false,
        maxRetries: definition.maxRetries ?? 2,
        retryCount: 0,
        estimatedCost: definition.estimatedCost ?? 0,
        actualCost: 0,
      };
    });

    const now = new Date().toISOString();
    const humanApprovalRequired =
      Boolean(input.strategic) ||
      Boolean(input.sensitive) ||
      (input.priority ?? 'medium') === 'critical';

    const workflow: Workflow = {
      id: `workflow-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      projectId: input.projectId,
      livingVisionId: input.livingVisionId,
      teamId: input.teamId,
      goal: input.goal,
      priority: input.priority ?? 'medium',
      requestedBy: input.requestedBy,
      strategic: input.strategic ?? false,
      sensitive: input.sensitive ?? false,
      status: humanApprovalRequired ? 'awaiting-approval' : 'approved',
      steps,
      currentStepIds: [],
      humanApprovalRequired,
      createdAt: now,
      updatedAt: now,
    };

    this.workflows.set(workflow.id, workflow);

    this.events.publish({
      workflowId: workflow.id,
      type: 'workflow-created',
      message: `Workflow created for goal: ${workflow.goal}`,
    });

    return this.clone(workflow);
  }

  approve(
    id: string,
    input: { approvedBy: string; action: 'approved' | 'rejected' },
  ): Workflow {
    const workflow = this.require(id);

    if (!input.approvedBy.toLowerCase().startsWith('human:')) {
      throw new Error('Workflow approval requires Human Final Authority.');
    }

    workflow.status = input.action === 'approved' ? 'approved' : 'failed';
    workflow.approvedBy = input.approvedBy;
    workflow.updatedAt = new Date().toISOString();

    this.events.publish({
      workflowId: workflow.id,
      type: 'workflow-approved',
      message: `Workflow decision: ${input.action} by ${input.approvedBy}`,
    });

    return this.clone(workflow);
  }

  start(id: string): Workflow {
    const workflow = this.require(id);

    if (workflow.status !== 'approved' && workflow.status !== 'paused') {
      throw new Error('Only approved or paused workflows can be started.');
    }

    workflow.status = 'running';
    workflow.updatedAt = new Date().toISOString();
    this.refreshReadySteps(workflow);

    this.events.publish({
      workflowId: workflow.id,
      type: 'workflow-started',
      message: 'Workflow execution started.',
    });

    return this.clone(workflow);
  }

  executeStep(
    workflowId: string,
    stepId: string,
    input: { actualCost?: number; fail?: boolean; error?: string },
  ): Workflow {
    const workflow = this.require(workflowId);
    const step = this.requireStep(workflow, stepId);

    if (workflow.status !== 'running') {
      throw new Error('Workflow must be running.');
    }

    if (step.status !== 'ready' && step.status !== 'running') {
      throw new Error(`Step ${step.id} is not ready for execution.`);
    }

    if (step.requiresHumanApproval && !step.approvedBy) {
      step.status = 'blocked';

      this.events.publish({
        workflowId,
        stepId,
        type: 'human-escalation',
        message: `Human approval required for step: ${step.name}`,
      });

      workflow.updatedAt = new Date().toISOString();
      return this.clone(workflow);
    }

    step.status = 'running';
    step.startedAt = step.startedAt ?? new Date().toISOString();

    this.events.publish({
      workflowId,
      stepId,
      type: 'step-started',
      message: `Step started: ${step.name}`,
    });

    if (input.fail) {
      step.retryCount += 1;
      step.error = input.error ?? 'Execution failure';
      step.actualCost += input.actualCost ?? 0;

      if (step.retryCount <= step.maxRetries) {
        step.status = 'ready';

        this.events.publish({
          workflowId,
          stepId,
          type: 'retry-scheduled',
          message: `Retry ${step.retryCount}/${step.maxRetries} scheduled.`,
        });
      } else {
        step.status = 'failed';
        workflow.status = 'failed';

        this.events.publish({
          workflowId,
          stepId,
          type: 'step-failed',
          message: step.error,
        });
      }

      workflow.updatedAt = new Date().toISOString();
      return this.clone(workflow);
    }

    step.status = 'completed';
    step.actualCost += input.actualCost ?? step.estimatedCost;
    step.completedAt = new Date().toISOString();

    const checkpoint = this.checkpoints.create({
      workflowId,
      stepId,
      state: workflow,
      reason: `Step completed: ${step.name}`,
    });

    step.checkpointId = checkpoint.id;

    this.events.publish({
      workflowId,
      stepId,
      type: 'step-completed',
      message: `Step completed: ${step.name}`,
    });

    this.events.publish({
      workflowId,
      stepId,
      type: 'checkpoint-created',
      message: `Checkpoint created: ${checkpoint.id}`,
    });

    this.refreshReadySteps(workflow);

    if (workflow.steps.every((item) => item.status === 'completed')) {
      workflow.status = 'completed';
      workflow.completedAt = new Date().toISOString();

      this.events.publish({
        workflowId,
        type: 'workflow-completed',
        message: 'Workflow completed successfully.',
      });
    }

    workflow.updatedAt = new Date().toISOString();
    return this.clone(workflow);
  }

  approveStep(
    workflowId: string,
    stepId: string,
    approvedBy: string,
  ): Workflow {
    const workflow = this.require(workflowId);
    const step = this.requireStep(workflow, stepId);

    if (!approvedBy.toLowerCase().startsWith('human:')) {
      throw new Error('Step approval requires Human Final Authority.');
    }

    step.approvedBy = approvedBy;
    step.status = 'ready';
    workflow.updatedAt = new Date().toISOString();

    return this.clone(workflow);
  }

  rollback(workflowId: string, checkpointId: string, approvedBy: string): Workflow {
    const workflow = this.require(workflowId);

    if (!approvedBy.toLowerCase().startsWith('human:')) {
      throw new Error('Rollback requires Human Final Authority.');
    }

    const checkpoint = this.checkpoints.get(checkpointId);

    if (checkpoint.workflowId !== workflowId) {
      throw new Error('Checkpoint does not belong to the workflow.');
    }

    workflow.status = 'rolled-back';
    workflow.updatedAt = new Date().toISOString();

    for (const step of workflow.steps) {
      if (step.status === 'completed' && step.checkpointId !== checkpointId) {
        step.status = 'rolled-back';
      }
    }

    this.events.publish({
      workflowId,
      type: 'workflow-rolled-back',
      message: `Workflow rolled back to checkpoint ${checkpointId}.`,
    });

    return this.clone(workflow);
  }

  get(id: string): Workflow {
    return this.clone(this.require(id));
  }

  list(): Workflow[] {
    return [...this.workflows.values()].map((workflow) => this.clone(workflow));
  }

  private refreshReadySteps(workflow: Workflow): void {
    for (const step of workflow.steps) {
      if (step.status !== 'pending') {
        continue;
      }

      const dependenciesComplete = step.dependsOn.every((dependencyId) => {
        const dependency = workflow.steps.find((item) => item.id === dependencyId);
        return dependency?.status === 'completed';
      });

      if (dependenciesComplete) {
        step.status = 'ready';
      }
    }

    workflow.currentStepIds = workflow.steps
      .filter((step) => step.status === 'ready' || step.status === 'running')
      .map((step) => step.id);
  }

  private require(id: string): Workflow {
    const workflow = this.workflows.get(id);

    if (!workflow) {
      throw new NotFoundException(`Workflow ${id} was not found.`);
    }

    return workflow;
  }

  private requireStep(workflow: Workflow, stepId: string): WorkflowStep {
    const step = workflow.steps.find((item) => item.id === stepId);

    if (!step) {
      throw new NotFoundException(`Workflow step ${stepId} was not found.`);
    }

    return step;
  }

  private clone(workflow: Workflow): Workflow {
    return JSON.parse(JSON.stringify(workflow)) as Workflow;
  }
}