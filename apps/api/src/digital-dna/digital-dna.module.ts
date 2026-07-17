import { Module } from "@nestjs/common";
import { DigitalDnaRegistryModule } from "./registry";
import { DigitalDnaIdentityModule } from "./identity";
import { DigitalDnaMetadataModule } from "./metadata";
import { DigitalDnaRelationshipsModule } from "./relationships";
import { DigitalDnaContractsModule } from "./contracts";
import { DigitalDnaPoliciesModule } from "./policies";
import { DigitalDnaEventsModule } from "./events";
import { DigitalDnaMetricsModule } from "./metrics";
import { DigitalDnaVersionsModule } from "./versions";
import { DigitalDnaEvolutionModule } from "./evolution";
import { DigitalDnaCertificationModule } from "./certification";

@Module({
  imports: [
    DigitalDnaRegistryModule,
    DigitalDnaIdentityModule,
    DigitalDnaMetadataModule,
    DigitalDnaRelationshipsModule,
    DigitalDnaContractsModule,
    DigitalDnaPoliciesModule,
    DigitalDnaEventsModule,
    DigitalDnaMetricsModule,
    DigitalDnaVersionsModule,
    DigitalDnaEvolutionModule,
    DigitalDnaCertificationModule
  ],
  exports: [
    DigitalDnaRegistryModule,
    DigitalDnaIdentityModule,
    DigitalDnaMetadataModule,
    DigitalDnaRelationshipsModule,
    DigitalDnaContractsModule,
    DigitalDnaPoliciesModule,
    DigitalDnaEventsModule,
    DigitalDnaMetricsModule,
    DigitalDnaVersionsModule,
    DigitalDnaEvolutionModule,
    DigitalDnaCertificationModule
  ],
})
export class DigitalDnaModule {}