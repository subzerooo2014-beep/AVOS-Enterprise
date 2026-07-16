import {
  Body,
  Controller,
  Get,
  Param,
  Post
} from "@nestjs/common";
import { FoundationCompletionPack14Service } from "./foundation-completion-pack-14.service";
import { UnifiedMetadataCatalogService } from "./catalog/unified-metadata-catalog.service";
import { MetadataClassificationEngineService } from "./classification/metadata-classification-engine.service";
import { MetadataDiscoveryService } from "./discovery/metadata-discovery.service";
import { MetadataLineageService } from "./lineage/metadata-lineage.service";
import { MetadataQualityEngineService } from "./quality/metadata-quality-engine.service";
import { MetadataPolicyEngineService } from "./policies/metadata-policy-engine.service";
import { MetadataSearchService } from "./search/metadata-search.service";
import { MetadataHealthService } from "./health/metadata-health.service";
import { MetadataAuditService } from "./observability/metadata-audit.service";
import {
  MetadataAssetType,
  MetadataClassificationRule,
  MetadataPolicy,
  MetadataRelationType,
  MetadataSearchQuery,
  MetadataSensitivity,
  MetadataStatus
} from "./foundation-pack-14.types";

@Controller("foundation-completion-v14")
export class FoundationCompletionPack14Controller {
  constructor(
    private readonly pack: FoundationCompletionPack14Service,
    private readonly catalog: UnifiedMetadataCatalogService,
    private readonly classification: MetadataClassificationEngineService,
    private readonly discovery: MetadataDiscoveryService,
    private readonly lineage: MetadataLineageService,
    private readonly quality: MetadataQualityEngineService,
    private readonly policies: MetadataPolicyEngineService,
    private readonly search: MetadataSearchService,
    private readonly health: MetadataHealthService,
    private readonly audit: MetadataAuditService
  ) {}

  @Get("status")
  status() {
    return this.pack.status();
  }

  @Get("verification")
  verification() {
    return this.pack.verification();
  }

  @Get("catalog")
  catalogList() {
    return {
      summary: this.catalog.summary(),
      items: this.catalog.list()
    };
  }

  @Get("catalog/:id")
  catalogRecord(@Param("id") id: string) {
    return this.catalog.get(id);
  }

  @Post("catalog")
  registerMetadata(
    @Body()
    body: {
      id?: string;
      assetId: string;
      assetType: MetadataAssetType;
      canonicalName: string;
      displayName: string;
      description: string;
      version: string;
      schemaVersion: string;
      sensitivity: MetadataSensitivity;
      domain: string;
      sourceSystem: string;
      ownerIdentityId: string;
      tags?: string[];
      classifications?: string[];
      attributes?: Record<string, unknown>;
      confidence?: number;
      correlationId: string;
      actorIdentityId: string;
    }
  ) {
    return this.catalog.register(body);
  }

  @Post("catalog/:id/update")
  updateMetadata(
    @Param("id") id: string,
    @Body()
    body: {
      patch: {
        displayName?: string;
        description?: string;
        version?: string;
        schemaVersion?: string;
        status?: MetadataStatus;
        sensitivity?: MetadataSensitivity;
        domain?: string;
        sourceSystem?: string;
        ownerIdentityId?: string;
        tags?: string[];
        classifications?: string[];
        attributes?: Record<string, unknown>;
        qualityScore?: number;
        confidence?: number;
      };
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.catalog.update(
      id,
      body.patch,
      {
        actorIdentityId: body.actorIdentityId,
        correlationId: body.correlationId
      }
    );
  }

  @Get("classification/rules")
  classificationRules() {
    return {
      summary: this.classification.summary(),
      items: this.classification.listRules()
    };
  }

  @Post("classification/rules")
  registerClassificationRule(
    @Body()
    body: {
      rule: Omit<
        MetadataClassificationRule,
        "createdAt" | "updatedAt"
      >;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.classification.register(
      body.rule,
      {
        actorIdentityId: body.actorIdentityId,
        correlationId: body.correlationId
      }
    );
  }

  @Post("classification/run")
  classifyMetadata(
    @Body()
    body: {
      metadataId: string;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.classification.classify(body);
  }

  @Get("discovery")
  discoveryList() {
    return {
      summary: this.discovery.summary(),
      items: this.discovery.list()
    };
  }

  @Post("discovery")
  discoverMetadata(
    @Body()
    body: {
      sourceSystem: string;
      assetId: string;
      assetType: MetadataAssetType;
      payload: Record<string, unknown>;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.discovery.discover(body);
  }

  @Post("lineage")
  linkLineage(
    @Body()
    body: {
      fromMetadataId: string;
      toMetadataId: string;
      relation: MetadataRelationType;
      reason: string;
      actorIdentityId: string;
      correlationId: string;
      metadata?: Record<string, unknown>;
    }
  ) {
    return this.lineage.link(body);
  }

  @Get("lineage/:id")
  metadataLineage(@Param("id") id: string) {
    return this.lineage.lineage(id);
  }

  @Post("quality/validate")
  validateQuality(
    @Body()
    body: {
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.quality.validate(body);
  }

  @Get("quality/findings")
  qualityFindings() {
    return {
      summary: this.quality.summary(),
      items: this.quality.list()
    };
  }

  @Get("policies")
  policyList() {
    return {
      summary: this.policies.summary(),
      items: this.policies.list()
    };
  }

  @Post("policies")
  registerPolicy(
    @Body()
    body: {
      policy: Omit<
        MetadataPolicy,
        "createdAt" | "updatedAt"
      >;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.policies.register(
      body.policy,
      {
        actorIdentityId: body.actorIdentityId,
        correlationId: body.correlationId
      }
    );
  }

  @Post("policies/evaluate")
  evaluatePolicy(
    @Body()
    body: {
      metadataId: string;
      policyId?: string;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.policies.evaluate(body);
  }

  @Post("search")
  searchMetadata(
    @Body()
    body: {
      query: MetadataSearchQuery;
      actorIdentityId: string;
      correlationId: string;
    }
  ) {
    return this.search.search(
      body.query,
      {
        actorIdentityId: body.actorIdentityId,
        correlationId: body.correlationId
      }
    );
  }

  @Post("health/calculate")
  calculateHealth(
    @Body()
    body: {
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
