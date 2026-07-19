import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { ArchitectureIntelligenceService } from "./architecture-intelligence.service";
import { RuntimeObservabilityService } from "./runtime-observability.service";
import { EvolutionControlService } from "./evolution-control.service";
import { FoundationUltraPackDStatusService } from "./foundation-ultra-pack-d-status.service";
import { FoundationUltraPackDAssuranceService } from "./foundation-ultra-pack-d-assurance.service";

@Controller("avos/foundation/ultra-pack-d")
export class FoundationUltraPackDController {
  constructor(
    private readonly architecture: ArchitectureIntelligenceService,
    private readonly observability: RuntimeObservabilityService,
    private readonly evolution: EvolutionControlService,
    private readonly statusService: FoundationUltraPackDStatusService,
    private readonly assurance: FoundationUltraPackDAssuranceService,
  ) {}

  @Get("status")
  status() {
    return this.statusService.status();
  }

  @Get("architecture/assets")
  architectureAssets() {
    return this.architecture.listAssets();
  }

  @Get("architecture/findings")
  architectureFindings() {
    return this.architecture.listFindings();
  }

  @Get("architecture/impact-analyses")
  impactAnalyses() {
    return this.architecture.listImpactAnalyses();
  }

  @Post("architecture/drift/detect")
  detectDrift(@Body() body: { assetId: string }) {
    return this.architecture.detectDrift(body.assetId);
  }

  @Post("architecture/impact/analyze")
  analyzeImpact(
    @Body()
    body: {
      changeId: string;
      targetAssetId: string;
    },
  ) {
    return this.architecture.analyzeImpact(
      body.changeId,
      body.targetAssetId,
    );
  }

  @Get("observability/metrics")
  metrics(@Query("component") component?: string) {
    return this.observability.listMetrics(component);
  }

  @Get("observability/health")
  healthSnapshots() {
    return this.observability.listHealthSnapshots();
  }

  @Get("observability/reliability")
  reliability() {
    return this.observability.reliabilitySummary();
  }

  @Post("observability/health/evaluate")
  evaluateHealth(@Body() body: { component: string }) {
    return this.observability.evaluateHealth(body.component);
  }

  @Get("evolution/proposals")
  evolutionProposals() {
    return this.evolution.listProposals();
  }

  @Get("evolution/executions")
  evolutionExecutions() {
    return this.evolution.listExecutions();
  }

  @Post("verification/run")
  verification() {
    return this.assurance.verification();
  }

  @Post("smoke/run")
  smoke() {
    return this.assurance.smoke();
  }

  @Post("certification/certify")
  certify(@Body() body: { approvedBy: string }) {
    return this.assurance.certify(body.approvedBy);
  }

  @Get("certification/status")
  certificationStatus() {
    return this.assurance.certificationStatus();
  }
}