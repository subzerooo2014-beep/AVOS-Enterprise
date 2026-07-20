import { Injectable } from "@nestjs/common";
import { StudioSectionBaseService } from "../foundation/studio-section-base.service";
import { StudioDomainService } from "../foundation/studio-domain.service";
import { AdaptiveGrowthStudioRegistryService } from "../foundation/adaptive-growth-studio-registry.service";

@Injectable()
export class NotificationAlertCenterService extends StudioSectionBaseService {
  readonly definition = {
    id: "notification-alert-center",
    name: "Notification & Alert Center",
    category: "section" as const,
    route: "/avos/products/adaptive-growth-studio/notification-alert-center",
    enabled: true,
    requiresHumanApproval: false,
    permissions: ["ags:notification-alert-center:read", "ags:notification-alert-center:write"],
    capabilities: ["notification-alert-center:read", "notification-alert-center:create", "notification-alert-center:manage"],
  };

  constructor(
    domain: StudioDomainService,
    registry: AdaptiveGrowthStudioRegistryService,
  ) {
    super(domain, registry);
  }
}