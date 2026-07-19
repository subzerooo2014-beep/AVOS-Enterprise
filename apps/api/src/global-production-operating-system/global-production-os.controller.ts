import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { AutonomousProductionEconomyService } from "./autonomous-production-economy.service";
import { CrossRegionReplicationService } from "./cross-region-replication.service";
import { DisasterRecoveryGridService } from "./disaster-recovery-grid.service";
import { GeoAwareOrchestrationService } from "./geo-aware-orchestration.service";
import { GlobalDigitalTwinService } from "./global-digital-twin.service";
import { GlobalFactoryRegistryService } from "./global-factory-registry.service";
import { GlobalProductionIntelligenceService } from "./global-production-intelligence.service";
import { GlobalProductionMarketplaceService } from "./global-production-marketplace.service";
import { GlobalProductionOsFinalCertificationService } from "./global-production-os-final-certification.service";
import { GlobalProductionOsRuntimeService } from "./global-production-os-runtime.service";
import { GlobalProductionOsStore } from "./global-production-os.store";
import { ProductionEvolutionEngineService } from "./production-evolution-engine.service";

@Controller("avos/global-production-os")
export class GlobalProductionOsController {
  constructor(
    private readonly runtime: GlobalProductionOsRuntimeService,
    private readonly store: GlobalProductionOsStore,
    private readonly registry: GlobalFactoryRegistryService,
    private readonly orchestration: GeoAwareOrchestrationService,
    private readonly replication: CrossRegionReplicationService,
    private readonly recovery: DisasterRecoveryGridService,
    private readonly intelligence: GlobalProductionIntelligenceService,
    private readonly marketplace: GlobalProductionMarketplaceService,
    private readonly economy: AutonomousProductionEconomyService,
    private readonly twin: GlobalDigitalTwinService,
    private readonly evolution: ProductionEvolutionEngineService,
    private readonly certification: GlobalProductionOsFinalCertificationService
  ) {}

  @Get("status")
  status() {
    return this.runtime.status();
  }

  @Get("factories")
  factories() {
    return this.registry.list();
  }

  @Post("factories/register")
  registerFactory(@Body() body: any) {
    return this.registry.register(body);
  }

  @Post("workloads")
  createWorkload(@Body() body: any) {
    return this.orchestration.createWorkload(body);
  }

  @Post("workloads/:id/route")
  route(@Param("id") id: string) {
    return this.orchestration.route(id);
  }

  @Post("workloads/:id/approve")
  approve(@Param("id") id: string, @Body() body: { approved: boolean }) {
    return this.orchestration.approve(id, body.approved);
  }

  @Post("replication/plan")
  planReplication(
    @Body()
    body: {
      workloadId: string;
      targetFactoryIds: string[];
      strategy?: "active-active" | "active-passive" | "multi-master";
    }
  ) {
    return this.replication.plan(
      body.workloadId,
      body.targetFactoryIds,
      body.strategy ?? "active-passive"
    );
  }

  @Post("replication/:id/execute")
  executeReplication(@Param("id") id: string) {
    return this.replication.execute(id);
  }

  @Post("recovery/plans")
  createRecoveryPlan(
    @Body()
    body: {
      primaryFactoryId: string;
      recoveryFactoryIds: string[];
      rpoMinutes?: number;
      rtoMinutes?: number;
    }
  ) {
    return this.recovery.createPlan(
      body.primaryFactoryId,
      body.recoveryFactoryIds,
      body.rpoMinutes,
      body.rtoMinutes
    );
  }

  @Post("recovery/:id/activate")
  activateRecovery(@Param("id") id: string) {
    return this.recovery.activate(id);
  }

  @Post("intelligence/forecast")
  forecast(@Body() body: { horizonHours?: number }) {
    return this.intelligence.forecast(body.horizonHours ?? 24);
  }

  @Post("marketplace/offers")
  publishOffer(@Body() body: any) {
    return this.marketplace.publish(
      body.factoryId,
      body.capability,
      body.availableCapacity,
      body.unitCost
    );
  }

  @Get("marketplace/offers")
  listOffers() {
    return this.marketplace.list();
  }

  @Get("economy/snapshot")
  economySnapshot() {
    return this.economy.snapshot();
  }

  @Get("digital-twin/snapshot")
  digitalTwinSnapshot() {
    return this.twin.snapshot();
  }

  @Post("evolution/proposals")
  proposeEvolution(@Body() body: any) {
    return this.evolution.propose(
      body.title,
      body.rationale,
      body.expectedImpact,
      body.riskLevel
    );
  }

  @Post("evolution/:id/decide")
  decideEvolution(
    @Param("id") id: string,
    @Body() body: { approved: boolean; approvedBy: string }
  ) {
    return this.evolution.decide(id, body.approved, body.approvedBy);
  }

  @Post("evolution/:id/deploy")
  deployEvolution(@Param("id") id: string) {
    return this.evolution.deploy(id);
  }

  @Post("final-review/run")
  finalReview() {
    return this.certification.runFinalReview();
  }

  @Post("certification/certify")
  certify(@Body() body: { approvedBy?: string }) {
    return this.certification.certify(body.approvedBy ?? "human:khalifa");
  }

  @Get("metrics")
  metrics() {
    return {
      factories: this.store.factories.size,
      workloads: this.store.workloads.size,
      routes: this.store.routingDecisions.size,
      complianceEvaluations: this.store.complianceEvaluations.size,
      replications: this.store.replicationPlans.size,
      recoveryPlans: this.store.recoveryPlans.size,
      forecasts: this.store.forecasts.size,
      offers: this.store.marketplaceOffers.size,
      economySnapshots: this.store.economySnapshots.size,
      twinSnapshots: this.store.digitalTwinSnapshots.size,
      evolutionProposals: this.store.evolutionProposals.size
    };
  }
}