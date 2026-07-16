import { Module } from "@nestjs/common";
import { FoundationCompletionPack14Controller } from "./foundation-completion-pack-14.controller";
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

@Module({
  controllers: [FoundationCompletionPack14Controller],
  providers: [
    FoundationCompletionPack14Service,
    UnifiedMetadataCatalogService,
    MetadataClassificationEngineService,
    MetadataDiscoveryService,
    MetadataLineageService,
    MetadataQualityEngineService,
    MetadataPolicyEngineService,
    MetadataSearchService,
    MetadataHealthService,
    MetadataAuditService
  ],
  exports: [
    FoundationCompletionPack14Service,
    UnifiedMetadataCatalogService,
    MetadataClassificationEngineService,
    MetadataDiscoveryService,
    MetadataLineageService,
    MetadataQualityEngineService,
    MetadataPolicyEngineService,
    MetadataSearchService,
    MetadataHealthService,
    MetadataAuditService
  ]
})
export class FoundationCompletionPack14Module {}
