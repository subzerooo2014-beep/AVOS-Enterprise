import { Module } from "@nestjs/common";
import { MetadataRegistryModule } from "./registry";
import { MetadataCatalogModule } from "./catalog";
import { MetadataSchemaModule } from "./schema";
import { MetadataLineageModule } from "./lineage";
import { MetadataGovernanceModule } from "./governance";
import { MetadataRelationshipModule } from "./relationship";
import { MetadataAnalyticsModule } from "./analytics";
import { MetadataAiModule } from "./ai";
import { MetadataCertificationModule } from "./certification";

@Module({
  imports: [
    MetadataRegistryModule,
    MetadataCatalogModule,
    MetadataSchemaModule,
    MetadataLineageModule,
    MetadataGovernanceModule,
    MetadataRelationshipModule,
    MetadataAnalyticsModule,
    MetadataAiModule,
    MetadataCertificationModule
  ],
  exports: [
    MetadataRegistryModule,
    MetadataCatalogModule,
    MetadataSchemaModule,
    MetadataLineageModule,
    MetadataGovernanceModule,
    MetadataRelationshipModule,
    MetadataAnalyticsModule,
    MetadataAiModule,
    MetadataCertificationModule
  ],
})
export class MetadataArchitectureModule {}