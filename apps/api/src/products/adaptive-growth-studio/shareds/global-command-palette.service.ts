import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  StudioCommand,
} from "../contracts/adaptive-growth-studio.contracts";
import { StudioSectionBaseService } from "../foundation/studio-section-base.service";
import { StudioDomainService } from "../foundation/studio-domain.service";
import { AdaptiveGrowthStudioRegistryService } from "../foundation/adaptive-growth-studio-registry.service";

@Injectable()
export class GlobalCommandPaletteService extends StudioSectionBaseService {
  readonly definition = {
    id: "global-command-palette",
    name: "Global Command Palette",
    category: "shared" as const,
    route: "/avos/products/adaptive-growth-studio/global-command-palette",
    enabled: true,
    requiresHumanApproval: true,
    permissions: ["ags:command:execute"],
    capabilities: ["command:parse", "command:plan", "command:approval"],
  };

  private readonly commands = new Map<string, StudioCommand>();

  constructor(
    domain: StudioDomainService,
    registry: AdaptiveGrowthStudioRegistryService,
  ) {
    super(domain, registry);
  }

  submit(input: {
    tenantId: string;
    userId: string;
    command: string;
    parameters?: Record<string, unknown>;
  }): StudioCommand {
    const item: StudioCommand = {
      id: `ags-command:${randomUUID()}`,
      tenantId: input.tenantId,
      userId: input.userId,
      command: input.command,
      parameters: { ...(input.parameters ?? {}) },
      status: "pending-approval",
      generatedAt: new Date().toISOString(),
    };
    this.commands.set(item.id, item);
    return this.clone(item);
  }

  listCommands() {
    return [...this.commands.values()].map((item) => this.clone(item));
  }

  override status() {
    return {
      ...super.status(),
      commands: this.commands.size,
    };
  }

  private clone(value: StudioCommand): StudioCommand {
    return JSON.parse(JSON.stringify(value)) as StudioCommand;
  }
}