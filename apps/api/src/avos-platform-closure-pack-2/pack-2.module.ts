import { Module } from '@nestjs/common';
import { CognitiveGovernanceModule } from '../avos-platform-closure-pack-0-5/cognitive-governance.module';
import { Pack1Module } from '../avos-platform-closure-pack-1/pack-1.module';
import { AgentRegistryService } from './agent-registry.service';
import { CollaborationBusService } from './collaboration-bus.service';
import { ConsensusEngineService } from './consensus-engine.service';
import { OrganizationGovernanceBridgeService } from './organization-governance-bridge.service';
import { Pack2Controller } from './pack-2.controller';
import { Pack2Service } from './pack-2.service';
import { TaskOrchestrationService } from './task-orchestration.service';
import { TeamRetrospectiveService } from './team-retrospective.service';
import { TeamRuntimeService } from './team-runtime.service';

@Module({
  imports: [CognitiveGovernanceModule, Pack1Module],
  controllers: [Pack2Controller],
  providers: [
    AgentRegistryService,
    OrganizationGovernanceBridgeService,
    TeamRuntimeService,
    TaskOrchestrationService,
    CollaborationBusService,
    ConsensusEngineService,
    TeamRetrospectiveService,
    Pack2Service,
  ],
  exports: [
    AgentRegistryService,
    TeamRuntimeService,
    TaskOrchestrationService,
    CollaborationBusService,
    ConsensusEngineService,
    Pack2Service,
  ],
})
export class Pack2Module {}