import { Injectable, NotFoundException } from '@nestjs/common';
import { ExecutionCheckpoint } from './execution-runtime.types';

@Injectable()
export class CheckpointEngineService {
  private readonly checkpoints = new Map<string, ExecutionCheckpoint>();

  create(input: {
    workflowId: string;
    stepId?: string;
    state: unknown;
    reason: string;
  }): ExecutionCheckpoint {
    const checkpoint: ExecutionCheckpoint = {
      id: `checkpoint-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      workflowId: input.workflowId,
      stepId: input.stepId,
      state: JSON.parse(JSON.stringify(input.state)),
      reason: input.reason,
      createdAt: new Date().toISOString(),
    };

    this.checkpoints.set(checkpoint.id, checkpoint);
    return JSON.parse(JSON.stringify(checkpoint));
  }

  get(id: string): ExecutionCheckpoint {
    const checkpoint = this.checkpoints.get(id);

    if (!checkpoint) {
      throw new NotFoundException(`Checkpoint ${id} was not found.`);
    }

    return JSON.parse(JSON.stringify(checkpoint));
  }

  list(workflowId?: string): ExecutionCheckpoint[] {
    return [...this.checkpoints.values()]
      .filter((checkpoint) => !workflowId || checkpoint.workflowId === workflowId)
      .map((checkpoint) => JSON.parse(JSON.stringify(checkpoint)));
  }
}