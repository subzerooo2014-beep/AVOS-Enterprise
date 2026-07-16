import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { FoundationCompletionPack2Service } from "./foundation-completion-pack-2.service";
import { FoundationIdentityService } from "./identity/foundation-identity.service";
import { UnifiedCapabilityRegistryService } from "./capability/unified-capability-registry.service";
import { EnterpriseDependencyGraphService } from "./dependency/enterprise-dependency-graph.service";
import {
  CapabilityAsset,
  FoundationIdentity,
  FoundationIdentityType
} from "./foundation-pack-2.types";

@Controller("foundation-completion-v2")
export class FoundationCompletionPack2Controller {
  constructor(
    private readonly pack: FoundationCompletionPack2Service,
    private readonly identities: FoundationIdentityService,
    private readonly capabilities: UnifiedCapabilityRegistryService,
    private readonly dependencies: EnterpriseDependencyGraphService
  ) {}

  @Get("status")
  status() {
    return this.pack.status();
  }

  @Get("verification")
  verification() {
    return this.pack.verification();
  }

  @Get("identities")
  listIdentities() {
    return {
      summary: this.identities.summary(),
      items: this.identities.list()
    };
  }

  @Get("identities/:id")
  getIdentity(@Param("id") id: string) {
    return this.identities.get(id);
  }

  @Post("identities")
  registerIdentity(
    @Body()
    body: {
      id: string;
      type: FoundationIdentityType;
      name: string;
      owner: string;
      trustLevel?: number;
      authorityLevel?: FoundationIdentity["authorityLevel"];
    }
  ) {
    return this.identities.register(body);
  }

  @Get("capabilities")
  listCapabilities() {
    return {
      summary: this.capabilities.summary(),
      items: this.capabilities.list()
    };
  }

  @Get("capabilities/:id")
  getCapability(@Param("id") id: string) {
    return this.capabilities.get(id);
  }

  @Post("capabilities")
  registerCapability(
    @Body() body: Omit<CapabilityAsset, "createdAt" | "updatedAt">
  ) {
    return this.capabilities.register(body);
  }

  @Get("dependency-graph")
  dependencyGraph() {
    return this.dependencies.graph();
  }

  @Get("impact/:id")
  impact(@Param("id") id: string) {
    return this.dependencies.impact(id);
  }
}
