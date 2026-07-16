import { Module } from "@nestjs/common";
import { EnterpriseBrainMegaPack5Controller } from "./enterprise-brain-mega-pack-5.controller";
import { EnterpriseBrainMegaPack5Service } from "./enterprise-brain-mega-pack-5.service";
import { BrainMultiAgentAuditService } from "./observability/brain-multi-agent-audit.service";
import { BrainAgentRegistryService } from "./agents/brain-agent-registry.service";
import { BrainSharedContextService } from "./context/brain-shared-context.service";
import { BrainDelegationService } from "./delegation/brain-delegation.service";
import { BrainConsensusService } from "./consensus/brain-consensus.service";
import { BrainConflictResolutionService } from "./conflict/brain-conflict-resolution.service";
import { BrainCoordinationRuntimeService } from "./coordination/brain-coordination-runtime.service";
import { BrainSupervisorService } from "./supervisor/brain-supervisor.service";
import { BrainAgentGovernanceService } from "./governance/brain-agent-governance.service";
import { BrainMultiAgentHealthService } from "./health/brain-multi-agent-health.service";

@Module({
  controllers: [EnterpriseBrainMegaPack5Controller],
  providers: [
    EnterpriseBrainMegaPack5Service,
    BrainMultiAgentAuditService,
    BrainAgentRegistryService,
    BrainSharedContextService,
    BrainDelegationService,
    BrainConsensusService,
    BrainConflictResolutionService,
    BrainCoordinationRuntimeService,
    BrainSupervisorService,
    BrainAgentGovernanceService,
    BrainMultiAgentHealthService
  ],
  exports: [
    EnterpriseBrainMegaPack5Service,
    BrainMultiAgentAuditService,
    BrainAgentRegistryService,
    BrainSharedContextService,
    BrainDelegationService,
    BrainConsensusService,
    BrainConflictResolutionService,
    BrainCoordinationRuntimeService,
    BrainSupervisorService,
    BrainAgentGovernanceService,
    BrainMultiAgentHealthService
  ]
})
export class EnterpriseBrainMegaPack5Module {}
