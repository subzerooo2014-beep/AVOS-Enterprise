import { Module } from "@nestjs/common";
import { DigitalGenomeRegistryModule } from "./registry";
import { DigitalGenomeCompositionModule } from "./composition";
import { DigitalGenomeCapabilitiesModule } from "./capabilities";
import { DigitalGenomeProductsModule } from "./products";
import { DigitalGenomeKnowledgeModule } from "./knowledge";
import { DigitalGenomeSecurityModule } from "./security";
import { DigitalGenomeIntegrationsModule } from "./integrations";
import { DigitalGenomeIntelligenceModule } from "./intelligence";
import { DigitalGenomeHealthModule } from "./health";
import { DigitalGenomeEvolutionModule } from "./evolution";
import { DigitalGenomeCertificationModule } from "./certification";

@Module({
  imports: [
    DigitalGenomeRegistryModule,
    DigitalGenomeCompositionModule,
    DigitalGenomeCapabilitiesModule,
    DigitalGenomeProductsModule,
    DigitalGenomeKnowledgeModule,
    DigitalGenomeSecurityModule,
    DigitalGenomeIntegrationsModule,
    DigitalGenomeIntelligenceModule,
    DigitalGenomeHealthModule,
    DigitalGenomeEvolutionModule,
    DigitalGenomeCertificationModule
  ],
  exports: [
    DigitalGenomeRegistryModule,
    DigitalGenomeCompositionModule,
    DigitalGenomeCapabilitiesModule,
    DigitalGenomeProductsModule,
    DigitalGenomeKnowledgeModule,
    DigitalGenomeSecurityModule,
    DigitalGenomeIntegrationsModule,
    DigitalGenomeIntelligenceModule,
    DigitalGenomeHealthModule,
    DigitalGenomeEvolutionModule,
    DigitalGenomeCertificationModule
  ],
})
export class DigitalGenomeModule {}