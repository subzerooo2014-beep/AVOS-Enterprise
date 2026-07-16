import {
  Body,
  Controller,
  Get,
  Param,
  Post
} from "@nestjs/common";
import { FoundationCompletionPack10Service } from "./foundation-completion-pack-10.service";
import { LivingBlueprintRegistryService } from "./blueprints/living-blueprint-registry.service";
import { BlueprintVersionManagerService } from "./versions/blueprint-version-manager.service";
import { BlueprintDiffEngineService } from "./diff/blueprint-diff-engine.service";
import { RuntimeArchitectureSnapshotService } from "./runtime/runtime-architecture-snapshot.service";
import { ArchitectureDriftDetectorService } from "./drift/architecture-drift-detector.service";
import { ArchitectureRuleEngineService } from "./rules/architecture-rule-engine.service";
import { ArchitectureCompatibilityValidatorService } from "./compatibility/architecture-compatibility-validator.service";
import { DependencyHealthAnalyzerService } from "./health/dependency-health-analyzer.service";
import { ArchitectureChangeImpactService } from "./impact/architecture-change-impact.service";
import { ArchitectureRecommendationEngineService } from "./recommendations/architecture-recommendation-engine.service";
import { FoundationHealthIndexService } from "./health/foundation-health-index.service";
import { ArchitectureAuditService } from "./observability/architecture-audit.service";
import {
  ArchitectureRecommendation,
  ArchitectureRule,
  LivingBlueprintAsset
} from "./foundation-pack-10.types";

@Controller("foundation-completion-v10")
export class FoundationCompletionPack10Controller {
  constructor(
    private readonly pack: FoundationCompletionPack10Service,
    private readonly blueprints: LivingBlueprintRegistryService,
    private readonly versions: BlueprintVersionManagerService,
    private readonly diff: BlueprintDiffEngineService,
    private readonly runtime: RuntimeArchitectureSnapshotService,
    private readonly drift: ArchitectureDriftDetectorService,
    private readonly rules: ArchitectureRuleEngineService,
    private readonly compatibility: ArchitectureCompatibilityValidatorService,
    private readonly dependencyHealth: DependencyHealthAnalyzerService,
    private readonly impact: ArchitectureChangeImpactService,
    private readonly recommendations: ArchitectureRecommendationEngineService,
    private readonly health: FoundationHealthIndexService,
    private readonly audit: ArchitectureAuditService
  ) {}

  @Get("status")
  status() {
    return this.pack.status();
  }

  @Get("verification")
  verification() {
    return this.pack.verification();
  }

  @Get("blueprints")
  blueprintList() {
    return {
      summary: this.blueprints.summary(),
      items: this.blueprints.list()
    };
  }

  @Get("blueprints/:id")
  blueprint(@Param("id") id: string) {
    return this.blueprints.get(id);
  }

  @Post("blueprints")
  registerBlueprint(
    @Body()
    body: {
      id?: string;
      name: string;
      description: string;
      version: string;
      architectureDomain: string;
      ownerIdentityId: string;
      sourceOfTruth?: boolean;
      assets?: LivingBlueprintAsset[];
      tags?: string[];
      correlationId: string;
      actorIdentityId: string;
    }
  ) {
    return this.blueprints.register(body);
  }

  @Post("blueprints/:id/assets")
  addBlueprintAsset(
    @Param("id") id: string,
    @Body()
    body: {
      asset: LivingBlueprintAsset;
      correlationId: string;
      actorIdentityId: string;
    }
  ) {
    return this.blueprints.addAsset(
      id,
      body.asset,
      {
        correlationId: body.correlationId,
        actorIdentityId: body.actorIdentityId
      }
    );
  }

  @Post("blueprints/:id/assets/:assetId/remove")
  removeBlueprintAsset(
    @Param("id") id: string,
    @Param("assetId") assetId: string,
    @Body()
    body: {
      correlationId: string;
      actorIdentityId: string;
    }
  ) {
    return this.blueprints.removeAsset(
      id,
      assetId,
      body
    );
  }

  @Get("blueprints/:id/versions")
  blueprintVersions(@Param("id") id: string) {
    return {
      blueprintId: id,
      items: this.versions.byBlueprint(id)
    };
  }

  @Post("blueprints/:id/versions")
  snapshotBlueprint(
    @Param("id") id: string,
    @Body()
    body: {
      changeSummary: string;
      changedByIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.versions.snapshot({
      blueprintId: id,
      ...body
    });
  }

  @Post("blueprints/:id/restore")
  restoreBlueprint(
    @Param("id") id: string,
    @Body()
    body: {
      version: string;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.versions.restore({
      blueprintId: id,
      ...body
    });
  }

  @Post("blueprints/:id/diff")
  compareBlueprintVersions(
    @Param("id") id: string,
    @Body()
    body: {
      fromVersion: string;
      toVersion: string;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.diff.compare({
      blueprintId: id,
      ...body
    });
  }

  @Get("runtime/snapshots")
  runtimeSnapshots() {
    return {
      summary: this.runtime.summary(),
      items: this.runtime.list()
    };
  }

  @Post("runtime/snapshots")
  captureRuntimeSnapshot(
    @Body()
    body: {
      environment: string;
      capturedByIdentityId: string;
      assets: LivingBlueprintAsset[];
      metadata?: Record<string, unknown>;
      correlationId: string;
    }
  ) {
    return this.runtime.capture(body);
  }

  @Post("drift/detect")
  detectDrift(
    @Body()
    body: {
      blueprintId: string;
      runtimeSnapshotId: string;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.drift.detect(body);
  }

  @Get("rules")
  ruleList() {
    return {
      summary: this.rules.summary(),
      items: this.rules.listRules()
    };
  }

  @Post("rules")
  registerRule(
    @Body()
    body: {
      rule: Omit<
        ArchitectureRule,
        "createdAt" | "updatedAt"
      >;
      correlationId: string;
      actorIdentityId: string;
    }
  ) {
    return this.rules.register(
      body.rule,
      {
        correlationId: body.correlationId,
        actorIdentityId: body.actorIdentityId
      }
    );
  }

  @Post("rules/evaluate")
  evaluateRules(
    @Body()
    body: {
      blueprintId: string;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.rules.evaluate(body);
  }

  @Post("compatibility/assess")
  assessCompatibility(
    @Body()
    body: {
      blueprintId: string;
      sourceVersion: string;
      targetVersion: string;
      assessedByIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.compatibility.assess(body);
  }

  @Post("dependency-health/analyze")
  analyzeDependencyHealth(
    @Body()
    body: {
      blueprintId: string;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.dependencyHealth.analyze(body);
  }

  @Post("impact/calculate")
  calculateImpact(
    @Body()
    body: {
      blueprintId: string;
      changedAssetIds: string[];
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.impact.calculate(body);
  }

  @Post("recommendations/generate")
  generateRecommendations(
    @Body()
    body: {
      blueprintId: string;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.recommendations.generate(body);
  }

  @Get("recommendations")
  recommendationList() {
    return {
      summary: this.recommendations.summary(),
      items: this.recommendations.list()
    };
  }

  @Post("recommendations/:id/status")
  updateRecommendationStatus(
    @Param("id") id: string,
    @Body()
    body: {
      status: ArchitectureRecommendation["status"];
    }
  ) {
    return this.recommendations.updateStatus(
      id,
      body.status
    );
  }

  @Post("health/calculate")
  calculateHealth(
    @Body()
    body: {
      blueprintId: string;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.health.calculate(body);
  }

  @Get("audit")
  auditList() {
    return {
      summary: this.audit.summary(),
      items: this.audit.list()
    };
  }
}
