import { Injectable, NotFoundException } from '@nestjs/common';
import {
  LivingMemoryRecord,
  LivingMemoryRecordInput,
} from './learning-memory.types';
import { LivingMemoryRepository } from './living-memory.repository';

@Injectable()
export class LivingMemoryService {
  constructor(private readonly repository: LivingMemoryRepository) {}

  capture(input: LivingMemoryRecordInput): LivingMemoryRecord {
    if (!input.projectId || !input.livingVisionId) {
      throw new Error('Project ID and Living Vision ID are mandatory.');
    }

    const requiresHumanApproval =
      Boolean(input.strategic) ||
      Boolean(input.sensitive) ||
      input.kind === 'decision' ||
      input.kind === 'vision-alignment';

    const now = new Date().toISOString();

    return this.repository.saveMemory({
      id: `living-memory-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,
      projectId: input.projectId,
      livingVisionId: input.livingVisionId,
      kind: input.kind,
      title: input.title,
      content: input.content,
      source: input.source,
      tags: input.tags ?? [],
      confidence: input.confidence ?? 80,
      strategic: input.strategic ?? false,
      sensitive: input.sensitive ?? false,
      evidence: input.evidence ?? [],
      status: requiresHumanApproval ? 'under-review' : 'approved',
      requiresHumanApproval,
      version: 1,
      createdAt: now,
      updatedAt: now,
    });
  }

  approve(
    id: string,
    input: {
      approvedBy: string;
      action: 'approved' | 'rejected';
      reason?: string;
    },
  ): LivingMemoryRecord {
    const memory = this.repository.getMemory(id);

    if (!memory) {
      throw new NotFoundException(`Memory ${id} was not found.`);
    }

    if (!input.approvedBy.toLowerCase().startsWith('human:')) {
      throw new Error('Memory approval requires Human Final Authority.');
    }

    memory.status = input.action;
    memory.approvedBy = input.approvedBy;
    memory.updatedAt = new Date().toISOString();

    if (input.reason) {
      memory.evidence = [...memory.evidence, `Approval note: ${input.reason}`];
    }

    return this.repository.saveMemory(memory);
  }

  supersede(
    id: string,
    input: LivingMemoryRecordInput & { approvedBy: string },
  ): LivingMemoryRecord {
    const current = this.repository.getMemory(id);

    if (!current) {
      throw new NotFoundException(`Memory ${id} was not found.`);
    }

    if (!input.approvedBy.toLowerCase().startsWith('human:')) {
      throw new Error('Strategic memory versioning requires human approval.');
    }

    current.status = 'superseded';
    current.updatedAt = new Date().toISOString();
    this.repository.saveMemory(current);

    const replacement = this.capture(input);
    replacement.supersedes = current.id;
    replacement.version = current.version + 1;
    replacement.status = 'approved';
    replacement.approvedBy = input.approvedBy;

    return this.repository.saveMemory(replacement);
  }

  get(id: string): LivingMemoryRecord {
    const memory = this.repository.getMemory(id);

    if (!memory) {
      throw new NotFoundException(`Memory ${id} was not found.`);
    }

    return memory;
  }

  list(): LivingMemoryRecord[] {
    return this.repository.listMemories();
  }

  approved(): LivingMemoryRecord[] {
    return this.list().filter((memory) => memory.status === 'approved');
  }
}