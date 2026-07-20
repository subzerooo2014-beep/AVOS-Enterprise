import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import {
  GrowthSignal,
} from "./contracts/agp-intelligence.contracts";
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

@Controller("avos/agp/mega-pack-1-3")
export class AgpMegaPack13Controller {
  constructor(
    private readonly runtime: AgpRuntimeService,
    private readonly bootstrapRegistry: AgpBootstrapRegistryService,
    private readonly registry: AgpRegistryService,
    private readonly events: AgpEventBusService,
    private readonly strategies: AgpStrategyService,
    private readonly planning: AgpPlanningService,
    private readonly brain: AgpGrowthBrainService,
    private readonly opportunities: AgpOpportunityRadarService,
    private readonly memory: AgpGrowthMemoryService,
    private readonly integrations: AgpIntegrationAdaptersService,
    private readonly governance: AgpGovernanceService,
    private readonly health: AgpHealthService,
    private readonly verification: AgpVerificationService,
    private readonly certification: AgpCertificationService,
  ) {}

  @Post("boot")
  boot() {
    const runtime = this.runtime.boot();
    const registry = this.bootstrapRegistry.bootstrap();
    return {
      name:
        "AVOS Growth Platform — Mega Pack 1–3 — Unified Foundation, Strategy & Growth Intelligence",
      version: "AGP-MP1-3-1.0.0",
      status: runtime.status,
      runtime,
      registry,
      foundationFirst: true,
      capabilityFirst: true,
      blueprintDriven: true,
      humanFinalAuthority: true,
      globalComplianceReadinessGate: true,
      bootedAt: runtime.bootedAt,
    };
  }

  @Get("status")
  status() {
    return this.health.status();
  }

  @Get("registry")
  registryStatus() {
    return this.registry.snapshot();
  }

  @Get("events")
  replayEvents(@Query("type") type?: string) {
    return this.events.replay(type);
  }

  @Post("strategies")
  createStrategy(
    @Body()
    body: {
      name: string;
      vision: string;
      theme: string;
      owner: string;
      dependencies?: string[];
    },
  ) {
    return this.strategies.create(body);
  }

  @Get("strategies")
  listStrategies() {
    return this.strategies.list();
  }

  @Post("strategies/:id/objectives")
  addObjective(
    @Param("id") id: string,
    @Body()
    body: {
      title: string;
      description: string;
      owner: string;
      keyResults: Array<{
        id: string;
        name: string;
        unit: string;
        baseline: number;
        target: number;
        current: number;
        weight: number;
      }>;
    },
  ) {
    return this.strategies.addObjective(id, body);
  }

  @Post("strategies/:id/approve")
  approveStrategy(
    @Param("id") id: string,
    @Body() body: { approvedBy: string },
  ) {
    return this.strategies.approve(id, body.approvedBy);
  }

  @Post("plans")
  createPlan(
    @Body()
    body: {
      strategyId: string;
      horizon: "annual" | "quarterly" | "monthly";
      scenario: string;
      milestones: string[];
      resources: Record<string, number>;
      dependencies: string[];
    },
  ) {
    return this.planning.create(body);
  }

  @Post("intelligence/recommend")
  recommend(
    @Body() body: { objective: string; signals: GrowthSignal[] },
  ) {
    return this.brain.recommend(body);
  }

  @Post("intelligence/decide")
  decide(
    @Body()
    body: {
      objective: string;
      options: string[];
      evidence: string[];
      approvedBy?: string;
    },
  ) {
    return this.brain.decide(body);
  }

  @Post("opportunities/scan")
  scanOpportunity(
    @Body()
    body: {
      title: string;
      category: string;
      description: string;
      signals: GrowthSignal[];
    },
  ) {
    return this.opportunities.scan(body);
  }

  @Get("opportunities")
  listOpportunities() {
    return this.opportunities.list();
  }

  @Post("memory")
  remember(
    @Body()
    body: {
      category: "decision" | "lesson" | "evidence" | "recommendation";
      subject: string;
      content: string;
      provenance: string[];
      tags: string[];
    },
  ) {
    return this.memory.remember(body);
  }

  @Get("memory/search")
  searchMemory(@Query("q") query = "") {
    return this.memory.search(query);
  }

  @Get("integrations")
  integrationsStatus() {
    return this.integrations.health();
  }

  @Get("governance")
  governanceStatus() {
    return {
      policies: this.governance.policies(),
      validation: this.governance.validate(),
    };
  }

  @Post("verification/run")
  runVerification() {
    return this.verification.run();
  }

  @Get("verification/status")
  verificationStatus() {
    return this.verification.status();
  }

  @Post("certification/certify")
  certify(@Body() body: { approvedBy: string }) {
    return this.certification.certify(body.approvedBy);
  }

  @Get("certification/status")
  certificationStatus() {
    return this.certification.status();
  }
}