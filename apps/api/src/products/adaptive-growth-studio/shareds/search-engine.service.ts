import { Injectable } from "@nestjs/common";
import { StudioSectionBaseService } from "../foundation/studio-section-base.service";
import { StudioDomainService } from "../foundation/studio-domain.service";
import { AdaptiveGrowthStudioRegistryService } from "../foundation/adaptive-growth-studio-registry.service";

@Injectable()
export class StudioSearchEngineService extends StudioSectionBaseService {
  readonly definition = {
    id: "search-engine",
    name: "Search Engine",
    category: "shared" as const,
    route: "/avos/products/adaptive-growth-studio/search-engine",
    enabled: true,
    requiresHumanApproval: false,
    permissions: ["ags:search"],
    capabilities: ["search:registry", "search:records", "search:commands"],
  };

  constructor(
    domain: StudioDomainService,
    registry: AdaptiveGrowthStudioRegistryService,
  ) {
    super(domain, registry);
  }

  search(query: string) {
    const normalized = query.trim().toLowerCase();
    return this.registry
      .list()
      .filter(
        (item) =>
          item.name.toLowerCase().includes(normalized) ||
          item.id.includes(normalized) ||
          item.capabilities.some((capability) =>
            capability.toLowerCase().includes(normalized),
          ),
      );
  }
}