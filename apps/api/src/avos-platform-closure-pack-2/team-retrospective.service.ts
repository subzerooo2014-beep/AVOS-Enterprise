import { Injectable } from '@nestjs/common';
import { LivingMemoryService } from '../avos-platform-closure-pack-1/living-memory.service';
import {
  TeamRetrospective,
  TeamRetrospectiveInput,
} from './digital-organization.types';
import { TeamRuntimeService } from './team-runtime.service';

@Injectable()
export class TeamRetrospectiveService {
  private readonly retrospectives: TeamRetrospective[] = [];

  constructor(
    private readonly teams: TeamRuntimeService,
    private readonly livingMemory: LivingMemoryService,
  ) {}

  publish(input: TeamRetrospectiveInput): TeamRetrospective {
    const team = this.teams.require(input.teamId);

    if (!input.completedBy.toLowerCase().startsWith('human:')) {
      throw new Error('Team retrospective publication requires human authority.');
    }

    const retrospective: TeamRetrospective = {
      id: `team-retrospective-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,
      teamId: input.teamId,
      completedBy: input.completedBy,
      summary: input.summary,
      strengths: input.strengths,
      weaknesses: input.weaknesses,
      lessons: input.lessons,
      improvements: input.improvements,
      publishedToLivingMemory: true,
      createdAt: new Date().toISOString(),
    };

    for (const lesson of input.lessons) {
      this.livingMemory.capture({
        projectId: team.projectId,
        livingVisionId: team.livingVisionId,
        kind: 'lesson',
        title: `Team lesson: ${lesson.slice(0, 80)}`,
        content: lesson,
        source: retrospective.id,
        tags: ['digital-organization', 'team-retrospective', 'shared-learning'],
        confidence: 95,
      });
    }

    this.retrospectives.push(retrospective);
    return JSON.parse(JSON.stringify(retrospective)) as TeamRetrospective;
  }

  list(): TeamRetrospective[] {
    return this.retrospectives.map((item) =>
      JSON.parse(JSON.stringify(item)),
    );
  }
}