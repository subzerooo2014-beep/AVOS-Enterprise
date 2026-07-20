import { StudioContext, StudioRecord, StudioSectionDefinition } from "../contracts/adaptive-growth-studio.contracts";
import { AdaptiveGrowthStudioRegistryService } from "./adaptive-growth-studio-registry.service";
import { StudioDomainService } from "./studio-domain.service";

export abstract class StudioSectionBaseService {
  abstract readonly definition: StudioSectionDefinition;

  constructor(
    protected readonly domain: StudioDomainService,
    protected readonly registry: AdaptiveGrowthStudioRegistryService,
  ) {}

  initialize() {
    return this.registry.register(this.definition);
  }

  create(
    context: StudioContext,
    input: {
      title: string;
      description?: string;
      data?: Record<string, unknown>;
    },
  ): StudioRecord {
    this.initialize();
    return this.domain.create(this.definition, context, input);
  }

  list(tenantId?: string) {
    return this.domain.list(this.definition.id, tenantId);
  }

  status() {
    return {
      ...this.definition,
      records: this.domain.countBySection(this.definition.id),
      status: "operational",
      score: 100,
      generatedAt: new Date().toISOString(),
    };
  }
}