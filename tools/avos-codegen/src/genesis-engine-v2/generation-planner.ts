import { DomainModule } from "./domain-decomposer";
import { ArchitectureDecision } from "./architecture-selector";

export interface GenerationStep {
  order: number;
  key: string;
  phase:
    | "foundation"
    | "domain"
    | "integration"
    | "validation"
    | "documentation"
    | "registration";
  generator: string;
  targets: string[];
  dependsOn: string[];
}

export interface GenerationPlan {
  steps: GenerationStep[];
  estimatedArtifacts: number;
}

export class GenerationPlanner {
  plan(
    modules: readonly DomainModule[],
    architecture: ArchitectureDecision,
  ): GenerationPlan {
    const steps: GenerationStep[] = [
      {
        order: 1,
        key: "generate-foundation",
        phase: "foundation",
        generator: "codegen-os.foundation",
        targets: [
          "configuration",
          "logging",
          "security",
          "events",
          "persistence",
        ],
        dependsOn: [],
      },
    ];

    for (const [index, module] of modules.entries()) {
      steps.push({
        order: index + 2,
        key: `generate-${module.key}`,
        phase: module.type === "integration" ? "integration" : "domain",
        generator: `codegen-os.${module.type}`,
        targets: [
          `${module.key}-module`,
          `${module.key}-service`,
          `${module.key}-controller`,
          `${module.key}-dto`,
          `${module.key}-tests`,
        ],
        dependsOn: module.dependencies,
      });
    }

    steps.push(
      {
        order: steps.length + 1,
        key: "generate-validation",
        phase: "validation",
        generator: "codegen-os.validation",
        targets: [
          "architecture-tests",
          "security-tests",
          "integration-tests",
          "smoke-tests",
        ],
        dependsOn: modules.map((module) => module.key),
      },
      {
        order: steps.length + 2,
        key: "generate-documentation",
        phase: "documentation",
        generator: "codegen-os.documentation",
        targets: [
          "system-overview",
          "architecture-decisions",
          "api-reference",
          "runbooks",
        ],
        dependsOn: ["generate-validation"],
      },
      {
        order: steps.length + 3,
        key: "register-enterprise-knowledge",
        phase: "registration",
        generator: "enterprise-brain.registration",
        targets: [
          "architecture-knowledge",
          "system-capabilities",
          "evolution-baseline",
        ],
        dependsOn: ["generate-documentation"],
      },
    );

    return {
      steps,
      estimatedArtifacts:
        modules.length * 5 +
        5 +
        4 +
        4 +
        3 +
        (architecture.style === "event-driven-platform" ? modules.length : 0),
    };
  }
}
