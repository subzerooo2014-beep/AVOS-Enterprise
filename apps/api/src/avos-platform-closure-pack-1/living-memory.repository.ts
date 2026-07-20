import { Injectable } from '@nestjs/common';
import {
  LivingMemoryRecord,
  ProjectRetrospective,
} from './learning-memory.types';

@Injectable()
export class LivingMemoryRepository {
  private readonly memories = new Map<string, LivingMemoryRecord>();
  private readonly retrospectives = new Map<string, ProjectRetrospective>();

  saveMemory(memory: LivingMemoryRecord): LivingMemoryRecord {
    this.memories.set(memory.id, JSON.parse(JSON.stringify(memory)));
    return this.getMemory(memory.id)!;
  }

  getMemory(id: string): LivingMemoryRecord | null {
    const memory = this.memories.get(id);
    return memory ? JSON.parse(JSON.stringify(memory)) : null;
  }

  listMemories(): LivingMemoryRecord[] {
    return [...this.memories.values()].map((memory) =>
      JSON.parse(JSON.stringify(memory)),
    );
  }

  saveRetrospective(retrospective: ProjectRetrospective): ProjectRetrospective {
    this.retrospectives.set(
      retrospective.id,
      JSON.parse(JSON.stringify(retrospective)),
    );

    return this.getRetrospective(retrospective.id)!;
  }

  getRetrospective(id: string): ProjectRetrospective | null {
    const retrospective = this.retrospectives.get(id);

    return retrospective
      ? JSON.parse(JSON.stringify(retrospective))
      : null;
  }

  listRetrospectives(): ProjectRetrospective[] {
    return [...this.retrospectives.values()].map((retrospective) =>
      JSON.parse(JSON.stringify(retrospective)),
    );
  }
}