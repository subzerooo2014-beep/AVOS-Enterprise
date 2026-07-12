import { randomUUID } from "node:crypto";

export interface ArchitectureCapability {
  key: string;
  type: "service" | "agent" | "workflow" | "data" | "policy";
  criticality: number;
  expectedLoad: number;
}

export interface ArchitectureComponent {
  id: string;
  key: string;
  pattern: string;
  replicas: number;
  dependencies: string[];
}

export interface SelfDesigningArchitectureResult {
  components: ArchitectureComponent[];
  architectureScore: number;
  patternsUsed: string[];
  generatedAt: string;
}

export class SelfDesigningArchitecture {
  design(
    capabilities: readonly ArchitectureCapability[],
  ): SelfDesigningArchitectureResult {
    const components = capabilities.map(
      (capability, index): ArchitectureComponent => {
        const pattern =
          capability.type === "agent"
            ? "event-driven-agent"
            : capability.type === "workflow"
              ? "saga-orchestrator"
              : capability.type === "data"
                ? "event-sourced-data-service"
                : capability.type === "policy"
                  ? "policy-decision-point"
                  : "modular-domain-service";

        return {
          id: randomUUID(),
          key: `${capability.key}-component`,
          pattern,
          replicas: Math.max(
            1,
            Math.min(
              12,
              Math.ceil(capability.expectedLoad / 25) +
                (capability.criticality >= 8 ? 2 : 0),
            ),
          ),
          dependencies:
            index === 0
              ? []
              : [`${capabilities[index - 1]?.key ?? "root"}-component`],
        };
      },
    );

    const architectureScore =
      components.length === 0
        ? 100
        : Math.round(
            capabilities.reduce(
              (sum, capability) =>
                sum +
                Math.min(
                  100,
                  capability.criticality * 8 +
                    Math.min(40, capability.expectedLoad * 0.4),
                ),
              0,
            ) / capabilities.length,
          );

    return {
      components,
      architectureScore,
      patternsUsed: Array.from(
        new Set(components.map((component) => component.pattern)),
      ),
      generatedAt: new Date().toISOString(),
    };
  }
}
