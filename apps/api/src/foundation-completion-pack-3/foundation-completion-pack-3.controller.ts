import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { FoundationCompletionPack3Service } from "./foundation-completion-pack-3.service";
import { EnterpriseLanguageCoreService } from "./language/enterprise-language-core.service";
import { MetadataSchemaRegistryService } from "./metadata/metadata-schema-registry.service";
import { EnterpriseContractLayerService } from "./contracts/enterprise-contract-layer.service";
import {
  EnterpriseContract,
  MetadataSchemaDefinition
} from "./foundation-pack-3.types";

@Controller("foundation-completion-v3")
export class FoundationCompletionPack3Controller {
  constructor(
    private readonly pack: FoundationCompletionPack3Service,
    private readonly language: EnterpriseLanguageCoreService,
    private readonly metadata: MetadataSchemaRegistryService,
    private readonly contracts: EnterpriseContractLayerService
  ) {}

  @Get("status")
  status() {
    return this.pack.status();
  }

  @Get("verification")
  verification() {
    return this.pack.verification();
  }

  @Get("language/concepts")
  concepts() {
    return {
      summary: this.language.summary(),
      items: this.language.list()
    };
  }

  @Get("language/search")
  searchConcepts(@Query("q") query = "") {
    return {
      query,
      items: this.language.search(query)
    };
  }

  @Get("language/relationships")
  relationships() {
    return {
      items: this.language.relationships()
    };
  }

  @Get("language/concepts/:id")
  concept(@Param("id") id: string) {
    return this.language.get(id);
  }

  @Get("metadata/schemas")
  schemas() {
    return {
      summary: this.metadata.summary(),
      items: this.metadata.list()
    };
  }

  @Get("metadata/schemas/:id")
  schema(@Param("id") id: string) {
    return this.metadata.get(id);
  }

  @Get("metadata/evolution/:assetType")
  evolution(@Param("assetType") assetType: string) {
    return this.metadata.evolution(assetType);
  }

  @Post("metadata/schemas")
  registerSchema(
    @Body()
    body: Omit<MetadataSchemaDefinition, "createdAt" | "updatedAt">
  ) {
    return this.metadata.register(body);
  }

  @Get("contracts")
  contractsList() {
    return {
      summary: this.contracts.summary(),
      items: this.contracts.list()
    };
  }

  @Get("contracts/:id")
  contract(@Param("id") id: string) {
    return this.contracts.get(id);
  }

  @Post("contracts")
  registerContract(
    @Body()
    body: Omit<EnterpriseContract, "createdAt" | "updatedAt">
  ) {
    return this.contracts.register(body);
  }

  @Post("contracts/compatibility")
  compatibility(
    @Body()
    body: {
      previousSchemaId: string;
      nextSchemaId: string;
    }
  ) {
    return this.contracts.validateSchemaEvolution(
      body.previousSchemaId,
      body.nextSchemaId
    );
  }
}
