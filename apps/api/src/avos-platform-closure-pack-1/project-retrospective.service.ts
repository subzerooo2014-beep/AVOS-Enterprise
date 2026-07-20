import { Injectable } from '@nestjs/common';
import {
  ProjectRetrospective,
  ProjectRetrospectiveInput,
} from './learning-memory.types';
import { LivingMemoryRepository } from './living-memory.repository';
import { LivingMemoryService } from './living-memory.service';

@Injectable()
export class ProjectRetrospectiveService {
  constructor(
    private readonly repository: LivingMemoryRepository,
    private readonly memory: LivingMemoryService,
  ) {}

  publish(input: ProjectRetrospectiveInput): ProjectRetrospective {
    if (!input.completedBy.toLowerCase().startsWith('human:')) {
      throw new Error('Project retrospective publication requires human authority.');
    }

    const retrospective: ProjectRetrospective = {
      id: `project-retrospective-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,
      projectId: input.projectId,
      livingVisionId: input.livingVisionId,
      completedBy: input.completedBy,
      summary: input.summary,
      successes: input.successes,
      failures: input.failures,
      lessons: input.lessons,
      reusableInsights: input.reusableInsights,
      followUpActions: input.followUpActions,
      publishedToSharedMemory: true,
      createdAt: new Date().toISOString(),
    };

    for (const lesson of input.lessons) {
      this.memory.capture({
        projectId: input.projectId,
        livingVisionId: input.livingVisionId,
        kind: 'lesson',
        title: `Retrospective lesson: ${lesson.slice(0, 80)}`,
        content: lesson,
        source: retrospective.id,
        tags: ['retrospective', 'shared-learning'],
        confidence: 95,
        evidence: [retrospective.id],
      });
    }

    for (const insight of input.reusableInsights) {
      this.memory.capture({
        projectId: input.projectId,
        livingVisionId: input.livingVisionId,
        kind: 'pattern',
        title: `Reusable insight: ${insight.slice(0, 80)}`,
        content: insight,
        source: retrospective.id,
        tags: ['cross-project', 'reusable-insight'],
        confidence: 90,
        evidence: [retrospective.id],
      });
    }

    return this.repository.saveRetrospective(retrospective);
  }

  list(): ProjectRetrospective[] {
    return this.repository.listRetrospectives();
  }
}