import { Injectable } from "@nestjs/common";
import { StudioSectionBaseService } from "../foundation/studio-section-base.service";
import { StudioDomainService } from "../foundation/studio-domain.service";
import { AdaptiveGrowthStudioRegistryService } from "../foundation/adaptive-growth-studio-registry.service";

@Injectable()
export class WorkspaceMemoryService extends StudioSectionBaseService {
  readonly definition = {
    id: "workspace-memory",
    name: "Workspace Memory",
    category: "shared" as const,
    route: "/avos/products/adaptive-growth-studio/workspace-memory",
    enabled: true,
    requiresHumanApproval: false,
    permissions: ["ags:workspace-memory:read", "ags:workspace-memory:write"],
    capabilities: ["workspace-memory:read", "workspace-memory:create", "workspace-memory:manage"],
  };

  constructor(
    domain: StudioDomainService,
    registry: AdaptiveGrowthStudioRegistryService,
  ) {
    super(domain, registry);
  }
}