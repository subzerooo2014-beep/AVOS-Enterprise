import { Module } from "@nestjs/common";
import { EnterpriseMetadataController } from "./enterprise-metadata.controller";
import { DependencyGraphService } from "./services/dependency-graph.service";
import { MetadataCertificationService } from "./services/metadata-certification.service";
import { MetadataGovernanceService } from "./services/metadata-governance.service";
import { MetadataHealthService } from "./services/metadata-health.service";
import { MetadataRegistryService } from "./services/metadata-registry.service";

@Module({
  controllers: [EnterpriseMetadataController],
  providers: [MetadataRegistryService, DependencyGraphService, MetadataGovernanceService, MetadataHealthService, MetadataCertificationService],
  exports: [MetadataRegistryService, DependencyGraphService, MetadataGovernanceService, MetadataHealthService],
})
export class EnterpriseMetadataModule {}
