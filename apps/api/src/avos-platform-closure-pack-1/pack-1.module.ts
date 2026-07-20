import { Module } from '@nestjs/common';
import { CognitiveGovernanceModule } from '../avos-platform-closure-pack-0-5/cognitive-governance.module';
import { LearningEngineService } from './learning-engine.service';
import { LearningGovernanceBridgeService } from './learning-governance-bridge.service';
import { LivingMemoryRepository } from './living-memory.repository';
import { LivingMemoryService } from './living-memory.service';
import { Pack1Controller } from './pack-1.controller';
import { Pack1Service } from './pack-1.service';
import { ProjectRetrospectiveService } from './project-retrospective.service';

@Module({
  imports: [CognitiveGovernanceModule],
  controllers: [Pack1Controller],
  providers: [
    LivingMemoryRepository,
    LivingMemoryService,
    LearningGovernanceBridgeService,
    LearningEngineService,
    ProjectRetrospectiveService,
    Pack1Service,
  ],
  exports: [
    LivingMemoryService,
    LearningEngineService,
    ProjectRetrospectiveService,
    Pack1Service,
  ],
})
export class Pack1Module {}