import {
  OmegaBundleBlueprint,
  OmegaCapabilityBlueprint,
} from "./omega-generator.types";
import {
  assertValidTypeScriptIdentifier,
  toKebabCase,
  toPascalCase,
} from "./omega-name.utilities";

export class OmegaBlueprintValidator {
  validate(blueprint: OmegaBundleBlueprint): void {
    if (!blueprint.bundle?.trim()) {
      throw new Error("Blueprint bundle is required");
    }

    if (!blueprint.namespace?.trim()) {
      throw new Error("Blueprint namespace is required");
    }

    if (!blueprint.targetRoot?.trim()) {
      throw new Error("Blueprint targetRoot is required");
    }

    if (!Array.isArray(blueprint.capabilities)) {
      throw new Error("Blueprint capabilities must be an array");
    }

    const seen = new Set<string>();

    for (const capability of blueprint.capabilities) {
      this.validateCapability(capability);

      const normalized = toKebabCase(capability.capability);

      if (seen.has(normalized)) {
        throw new Error(`Duplicate capability: ${normalized}`);
      }

      seen.add(normalized);
    }
  }

  private validateCapability(
    capability: OmegaCapabilityBlueprint,
  ): void {
    if (!capability.capability?.trim()) {
      throw new Error("Capability name is required");
    }

    if (!capability.domain?.trim()) {
      throw new Error(
        `Capability domain is required: ${capability.capability}`,
      );
    }

    if (!capability.route?.trim()) {
      throw new Error(
        `Capability route is required: ${capability.capability}`,
      );
    }

    if (!Array.isArray(capability.actions)) {
      throw new Error(
        `Capability actions must be an array: ${capability.capability}`,
      );
    }

    const classBase = toPascalCase(capability.capability);

    assertValidTypeScriptIdentifier(
      `${classBase}Service`,
      "service class",
    );
    assertValidTypeScriptIdentifier(
      `${classBase}Controller`,
      "controller class",
    );
    assertValidTypeScriptIdentifier(
      `${classBase}Module`,
      "module class",
    );
  }
}