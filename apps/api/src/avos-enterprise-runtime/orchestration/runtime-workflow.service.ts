import { Injectable } from '@nestjs/common';
import { createRuntimeId, nowIso } from '../shared/runtime.utils';

export interface WorkflowStep {
  id: string;
  execute: (context: Record<string, unknown>) => unknown | Promise<unknown>;
}

export interface WorkflowExecution {
  id: string;
  workflow: string;
  status: 'running' | 'completed' | 'failed';
  startedAt: string;
  completedAt?: string;
  results: Array<{ step: string; result: unknown }>;
  error?: string;
}

@Injectable()
export class RuntimeWorkflowService {
  private readonly workflows = new Map<string, WorkflowStep[]>();

  register(name: string, steps: WorkflowStep[]): void {
    this.workflows.set(name, [...steps]);
  }

  async execute(
    name: string,
    context: Record<string, unknown>,
  ): Promise<WorkflowExecution> {
    const steps = this.workflows.get(name);
    if (!steps) throw new Error(`Workflow not found: ${name}`);

    const execution: WorkflowExecution = {
      id: createRuntimeId('workflow'),
      workflow: name,
      status: 'running',
      startedAt: nowIso(),
      results: [],
    };

    try {
      for (const step of steps) {
        const result = await step.execute(context);
        execution.results.push({
          step: step.id,
          result,
        });
      }

      execution.status = 'completed';
      execution.completedAt = nowIso();
      return execution;
    } catch (error) {
      execution.status = 'failed';
      execution.error =
        error instanceof Error ? error.message : String(error);
      execution.completedAt = nowIso();
      return execution;
    }
  }

  count(): number {
    return this.workflows.size;
  }
}