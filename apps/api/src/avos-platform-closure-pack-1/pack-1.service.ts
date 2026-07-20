import { Injectable } from '@nestjs/common';
import { LearningEngineService } from './learning-engine.service';
import { LivingMemoryRepository } from './living-memory.repository';
import { LivingMemoryService } from './living-memory.service';
import { Pack1Status } from './learning-memory.types';
import { ProjectRetrospectiveService } from './project-retrospective.service';

@Injectable()
export class Pack1Service {
  constructor(
    private readonly memory: LivingMemoryService,
    private readonly learning: LearningEngineService,
    private readonly retrospectives: ProjectRetrospectiveService,
    private readonly repository: LivingMemoryRepository,
  ) {}

  status(): Pack1Status {
    const memories = this.memory.list();
    const proposals = this.learning.list();
    const retrospectives = this.retrospectives.list();

    return {
      name: 'AVOS Learning & Living Memory',
      version: 'PC-P1-1.0.0',
      status: 'operational',
      layer: 'Learning & Living Memory',
      metrics: {
        memoryRecords: memories.length,
        approvedMemories: memories.filter((memory) => memory.status === 'approved').length,
        pendingMemories: memories.filter((memory) => memory.status === 'under-review').length,
        learningProposals: proposals.length,
        approvedLearningProposals: proposals.filter(
          (proposal) => proposal.status === 'approved',
        ).length,
        retrospectives: retrospectives.length,
        sharedLessons: memories.filter((memory) =>
          memory.tags.includes('shared-learning') ||
          memory.tags.includes('cross-project'),
        ).length,
      },
      controls: {
        governanceBeforeLearning: true,
        humanFinalAuthority: true,
        humanApprovalForStrategicLearning: true,
        livingVisionRequired: true,
        projectRetrospectiveRequired: true,
        crossProjectKnowledgeSharing: true,
        noUnapprovedSelfModification: true,
      },
    };
  }
}