export interface ArchitectureDecision {
  style: "modular-monolith" | "service-oriented" | "event-driven-platform";
  dataStrategy: "single-database" | "schema-per-domain" | "database-per-service";
  workflowStrategy: "orchestrated" | "choreographed" | "hybrid";
  score: number;
  rationale: string[];
}

export class ArchitectureSelector {
  select(complexityScore: number, domainCount: number): ArchitectureDecision {
    if (complexityScore >= 70 || domainCount >= 8) {
      return {
        style: "event-driven-platform",
        dataStrategy: "schema-per-domain",
        workflowStrategy: "hybrid",
        score: 96,
        rationale: [
          "high-domain-complexity",
          "requires-independent-evolution",
          "supports-autonomous-agents",
        ],
      };
    }

    if (complexityScore >= 40 || domainCount >= 4) {
      return {
        style: "service-oriented",
        dataStrategy: "schema-per-domain",
        workflowStrategy: "orchestrated",
        score: 90,
        rationale: [
          "moderate-domain-complexity",
          "clear-bounded-contexts",
          "central-workflow-governance",
        ],
      };
    }

    return {
      style: "modular-monolith",
      dataStrategy: "single-database",
      workflowStrategy: "orchestrated",
      score: 88,
      rationale: [
        "low-operational-complexity",
        "fast-initial-delivery",
        "preserves-modular-boundaries",
      ],
    };
  }
}
