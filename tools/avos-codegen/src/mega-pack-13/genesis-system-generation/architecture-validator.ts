import {
  GenesisArchitectureValidation,
  GenesisBlueprintComposition,
  GenesisCapabilityGraph,
  GenesisFinding,
  GenesisFindingSeverity,
  GenesisSystemSpecification,
} from "./contracts";

export class GenesisArchitectureValidator {
  validate(
    specification:
      GenesisSystemSpecification,
    composition:
      GenesisBlueprintComposition,
    graph:
      GenesisCapabilityGraph,
  ): GenesisArchitectureValidation {
    const findings:
      GenesisFinding[] = [];

    if (!composition.successful) {
      findings.push({
        code:
          "BLUEPRINT_COMPOSITION_FAILED",
        severity:
          GenesisFindingSeverity.ERROR,
        message:
          "Blueprint composition did not satisfy all required requests and capabilities.",
        metadata: {},
      });
    }

    for (
      const capability of
      specification.capabilities
    ) {
      const providers =
        composition.capabilityCoverage[
          capability.key
        ] ?? [];

      if (
        capability.required &&
        providers.length === 0
      ) {
        findings.push({
          code:
            "REQUIRED_CAPABILITY_UNCOVERED",
          severity:
            GenesisFindingSeverity.ERROR,
          message:
            `Required capability has no provider: ${capability.key}`,
          subject:
            capability.key,
          metadata: {
            priority:
              capability.priority,
          },
        });
      }
    }

    if (graph.cycles.length > 0) {
      findings.push({
        code:
          "CAPABILITY_DEPENDENCY_CYCLE",
        severity:
          GenesisFindingSeverity.CRITICAL,
        message:
          `Capability graph contains ${graph.cycles.length} cycle(s).`,
        metadata: {
          cycles:
            graph.cycles,
        },
      });
    }

    for (
      const blueprint of
      composition.selectedBlueprints
    ) {
      const selectedKeys =
        new Set(
          composition.selectedBlueprints.map(
            (item) => item.key,
          ),
        );

      const conflicts =
        blueprint.conflicts.filter(
          (conflict) =>
            selectedKeys.has(conflict),
        );

      if (conflicts.length > 0) {
        findings.push({
          code:
            "BLUEPRINT_CONFLICT",
          severity:
            GenesisFindingSeverity.ERROR,
          message:
            `Blueprint ${blueprint.key} conflicts with selected blueprints.`,
          subject:
            blueprint.key,
          metadata: {
            conflicts,
          },
        });
      }
    }

    const penalty =
      findings.reduce(
        (total, finding) =>
          total +
          this.penaltyFor(
            finding.severity,
          ),
        0,
      );

    const score =
      Math.max(
        0,
        100 - penalty,
      );

    const valid =
      !findings.some(
        (finding) =>
          finding.severity ===
            GenesisFindingSeverity.ERROR ||
          finding.severity ===
            GenesisFindingSeverity.CRITICAL,
      );

    return {
      systemId: specification.id,
      valid,
      score,
      findings,
      validatedAt:
        new Date().toISOString(),
    };
  }

  private penaltyFor(
    severity: GenesisFindingSeverity,
  ): number {
    switch (severity) {
      case GenesisFindingSeverity.CRITICAL:
        return 50;
      case GenesisFindingSeverity.ERROR:
        return 25;
      case GenesisFindingSeverity.WARNING:
        return 10;
      case GenesisFindingSeverity.INFO:
        return 2;
    }
  }
}
