import { Injectable } from "@nestjs/common";
import { StudioSectionBaseService } from "../foundation/studio-section-base.service";
import { StudioDomainService } from "../foundation/studio-domain.service";
import { AdaptiveGrowthStudioRegistryService } from "../foundation/adaptive-growth-studio-registry.service";

@Injectable()
export class StudioNotificationEngineService extends StudioSectionBaseService {
  readonly definition = {
    id: "notification-engine",
    name: "Notification Engine",
    category: "shared" as const,
    route: "/avos/products/adaptive-growth-studio/notification-engine",
    enabled: true,
    requiresHumanApproval: false,
    permissions: ["ags:notification-engine:read", "ags:notification-engine:write"],
    capabilities: ["notification-engine:read", "notification-engine:create", "notification-engine:manage"],
  };

  constructor(
    domain: StudioDomainService,
    registry: AdaptiveGrowthStudioRegistryService,
  ) {
    super(domain, registry);
  }
}