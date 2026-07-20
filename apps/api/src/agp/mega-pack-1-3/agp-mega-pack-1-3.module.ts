import { Module } from "@nestjs/common";
import { AgpCertificationService } from "./certification/agp-certification.service";
import { AgpEventBusService } from "./events/agp-event-bus.service";
import { AgpGovernanceService } from "./governance/agp-governance.service";
import { AgpHealthService } from "./health/agp-health.service";
import { AgpGrowthBrainService } from "./intelligence/agp-growth-brain.service";
import { AgpOpportunityRadarService } from "./intelligence/agp-opportunity-radar.service";
import { AgpIntegrationAdaptersService } from "./integration/agp-integration-adapters.service";
import { AgpGrowthMemoryService } from "./memory/agp-growth-memory.service";
import { AgpBootstrapRegistryService } from "./registry/agp-bootstrap-registry.service";
import { AgpRegistryService } from "./registry/agp-registry.service";
import { AgpRuntimeService } from "./runtime/agp-runtime.service";
import { AgpPlanningService } from "./strategy/agp-planning.service";
import { AgpStrategyService } from "./strategy/agp-strategy.service";
import { AgpVerificationService } from "./verification/agp-verification.service";
import { AgpMegaPack13Controller } from "./agp-mega-pack-1-3.controller";

@Module({
  controllers: [AgpMegaPack13Controller],
  providers: [
    AgpRuntimeService,
    AgpRegistryService,
    AgpBootstrapRegistryService,
    AgpEventBusService,
    AgpStrategyService,
    AgpPlanningService,
    AgpGrowthBrainService,
    AgpOpportunityRadarService,
    AgpGrowthMemoryService,
    AgpIntegrationAdaptersService,
    AgpGovernanceService,
    AgpHealthService,
    AgpVerificationService,
    AgpCertificationService,
  ],
  exports: [
    AgpRuntimeService,
    AgpRegistryService,
    AgpEventBusService,
    AgpStrategyService,
    AgpPlanningService,
    AgpGrowthBrainService,
    AgpOpportunityRadarService,
    AgpGrowthMemoryService,
    AgpIntegrationAdaptersService,
    AgpGovernanceService,
    AgpHealthService,
    AgpVerificationService,
    AgpCertificationService,
  ],
})
export class AgpMegaPack13Module {}