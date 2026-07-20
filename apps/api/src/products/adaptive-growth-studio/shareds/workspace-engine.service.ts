import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  StudioWorkspace,
} from "../contracts/adaptive-growth-studio.contracts";
import { StudioSectionBaseService } from "../foundation/studio-section-base.service";
import { StudioDomainService } from "../foundation/studio-domain.service";
import { AdaptiveGrowthStudioRegistryService } from "../foundation/adaptive-growth-studio-registry.service";

@Injectable()
export class WorkspaceEngineService extends StudioSectionBaseService {
  readonly definition = {
    id: "workspace-engine",
    name: "Workspace Engine",
    category: "shared" as const,
    route: "/avos/products/adaptive-growth-studio/workspace-engine",
    enabled: true,
    requiresHumanApproval: false,
    permissions: ["ags:workspace:read", "ags:workspace:write"],
    capabilities: ["workspace:create", "workspace:members", "workspace:products"],
  };

  private readonly workspaces = new Map<string, StudioWorkspace>();

  constructor(
    domain: StudioDomainService,
    registry: AdaptiveGrowthStudioRegistryService,
  ) {
    super(domain, registry);
  }

  createWorkspace(input: {
    tenantId: string;
    name: string;
    productIds?: string[];
    memberIds?: string[];
    createdBy: string;
  }): StudioWorkspace {
    const now = new Date().toISOString();
    const workspace: StudioWorkspace = {
      id: `ags-workspace:${randomUUID()}`,
      tenantId: input.tenantId,
      name: input.name,
      productIds: [...(input.productIds ?? [])],
      memberIds: [...(input.memberIds ?? [])],
      createdBy: input.createdBy,
      createdAt: now,
      updatedAt: now,
    };
    this.workspaces.set(workspace.id, workspace);
    return this.clone(workspace);
  }

  listWorkspaces(tenantId?: string) {
    return [...this.workspaces.values()]
      .filter((item) => !tenantId || item.tenantId === tenantId)
      .map((item) => this.clone(item));
  }

  override status() {
    return {
      ...super.status(),
      workspaces: this.workspaces.size,
    };
  }

  private clone(value: StudioWorkspace): StudioWorkspace {
    return JSON.parse(JSON.stringify(value)) as StudioWorkspace;
  }
}