import {
  GenesisBlueprintCatalog,
} from "./blueprint-catalog";
import {
  GenesisBlueprintComposition,
  GenesisBlueprintResolution,
  GenesisSystemSpecification,
} from "./contracts";

export class GenesisBlueprintComposer {
  constructor(
    readonly catalog:
      GenesisBlueprintCatalog,
  ) {}

  compose(
    specification:
      GenesisSystemSpecification,
  ): GenesisBlueprintComposition {
    const resolutions:
      GenesisBlueprintResolution[] =
      specification.blueprintRequests.map(
        (request) => {
          const resolved =
            this.catalog.resolve(
              request.key,
              request.versionRange,
            );

          if (!resolved) {
            return {
              request:
                structuredClone(request),
              success:
                !request.required,
              reasons: [
                request.required
                  ? "Required blueprint could not be resolved."
                  : "Optional blueprint was not available.",
              ],
            };
          }

          return {
            request:
              structuredClone(request),
            success: true,
            reasons: [],
            resolved,
          };
        },
      );

    const selectedBlueprints =
      resolutions.flatMap((resolution) =>
        resolution.resolved
          ? [structuredClone(resolution.resolved)]
          : [],
      );

    const capabilityCoverage:
      Record<string, string[]> = {};

    for (
      const requirement of
      specification.capabilities
    ) {
      capabilityCoverage[
        requirement.key
      ] = selectedBlueprints
        .filter((blueprint) =>
          blueprint.capabilities.includes(
            requirement.key,
          ),
        )
        .map((blueprint) =>
          blueprint.key,
        );
    }

    const successful =
      resolutions.every(
        (resolution) =>
          resolution.success,
      ) &&
      specification.capabilities
        .filter((capability) =>
          capability.required,
        )
        .every(
          (capability) =>
            (
              capabilityCoverage[
                capability.key
              ] ?? []
            ).length > 0,
        );

    return {
      systemId: specification.id,
      successful,
      resolutions,
      selectedBlueprints,
      capabilityCoverage,
      generatedAt:
        new Date().toISOString(),
    };
  }
}
