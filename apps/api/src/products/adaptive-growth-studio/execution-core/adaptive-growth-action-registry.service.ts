import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { AgsActionDefinition } from "./adaptive-growth-execution.contracts";

@Injectable()
export class AdaptiveGrowthActionRegistryService {
  private readonly definitions =
    new Map<string, AgsActionDefinition>();

  constructor() {
    this.registerDefaults();
  }

  register(
    definition: AgsActionDefinition,
  ): AgsActionDefinition {
    this.definitions.set(definition.key, {
      ...definition,
    });

    return definition;
  }

  list(): AgsActionDefinition[] {
    return [...this.definitions.values()];
  }

  get(key: string): AgsActionDefinition {
    const definition = this.definitions.get(key);

    if (!definition) {
      throw new NotFoundException(
        `Action definition not found: ${key}`,
      );
    }

    return definition;
  }

  status() {
    const definitions = this.list();

    return {
      name: "AGS Action Registry",
      version: "AGS-MP2A-1.0.0",
      status: "operational",
      total: definitions.length,
      enabled: definitions.filter(
        (item) => item.enabled,
      ).length,
      rollbackSupported: definitions.filter(
        (item) => item.supportsRollback,
      ).length,
      humanFinalAuthorityReady: true,
    };
  }

  private registerDefaults(): void {
    const defaults: AgsActionDefinition[] = [
      {
        key: "growth.strategy.activate",
        name: "Activate Growth Strategy",
        description:
          "Activates an approved adaptive growth strategy.",
        capability: "adaptive-growth-platform",
        riskLevel: "high",
        requiresApproval: true,
        supportsRollback: true,
        enabled: true,
        version: "1.0.0",
      },
      {
        key: "growth.experiment.launch",
        name: "Launch Growth Experiment",
        description:
          "Launches a controlled growth experiment.",
        capability: "adaptive-growth-engine",
        riskLevel: "medium",
        requiresApproval: true,
        supportsRollback: true,
        enabled: true,
        version: "1.0.0",
      },
      {
        key: "growth.opportunity.evaluate",
        name: "Evaluate Growth Opportunity",
        description:
          "Evaluates an opportunity without external side effects.",
        capability: "adaptive-growth-engine",
        riskLevel: "low",
        requiresApproval: false,
        supportsRollback: false,
        enabled: true,
        version: "1.0.0",
      },
      {
        key: "knowledge.context.refresh",
        name: "Refresh Knowledge Context",
        description:
          "Refreshes the knowledge context used by growth decisions.",
        capability: "knowledge-fabric",
        riskLevel: "low",
        requiresApproval: false,
        supportsRollback: false,
        enabled: true,
        version: "1.0.0",
      },
      {
        key: "capability.workflow.dispatch",
        name: "Dispatch Capability Workflow",
        description:
          "Dispatches an execution request through Capability Fabric.",
        capability: "capability-fabric",
        riskLevel: "critical",
        requiresApproval: true,
        supportsRollback: true,
        enabled: true,
        version: "1.0.0",
      },
    ];

    for (const definition of defaults) {
      this.register(definition);
    }
  }
}