import { Injectable } from "@nestjs/common";
import { StudioSectionBaseService } from "../foundation/studio-section-base.service";
import { StudioDomainService } from "../foundation/studio-domain.service";
import { AdaptiveGrowthStudioRegistryService } from "../foundation/adaptive-growth-studio-registry.service";

@Injectable()
export class WorkflowOrchestrationCenterService extends StudioSectionBaseService {
  readonly definition = {
    id: "workflow-orchestration-center",
    name: "Workflow Orchestration Center",
    category: "section" as const,
    route: "/avos/products/adaptive-growth-studio/workflow-orchestration-center",
    enabled: true,
    requiresHumanApproval: true,
    permissions: ["ags:workflow-orchestration-center:read", "ags:workflow-orchestration-center:write"],
    capabilities: ["workflow-orchestration-center:read", "workflow-orchestration-center:create", "workflow-orchestration-center:manage"],
  };

  constructor(
    domain: StudioDomainService,
    registry: AdaptiveGrowthStudioRegistryService,
  ) {
    super(domain, registry);
  }
}