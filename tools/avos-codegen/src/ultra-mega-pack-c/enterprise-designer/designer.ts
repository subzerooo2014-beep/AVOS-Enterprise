import {
  EnterpriseDesign,
  EnterpriseDesignRequest,
} from "./contracts";

export class AutonomousEnterpriseDesigner {
  design(request: EnterpriseDesignRequest): EnterpriseDesign {
    const components = request.capabilities.map((capability) => ({
      key: `${this.normalize(capability.key)}-service`,
      name: `${capability.name} Service`,
      kind: "service",
      responsibilities: [capability.description],
      dependencies: [...capability.dependencies],
      capabilities: [capability.key],
    }));

    const capabilityCoverage: Record<string, string[]> = {};

    for (const capability of request.capabilities) {
      capabilityCoverage[capability.key] = components
        .filter((component) =>
          component.capabilities.includes(capability.key),
        )
        .map((component) => component.key);
    }

    const unresolvedCapabilities = request.capabilities
      .filter((capability) => capability.required)
      .filter(
        (capability) =>
          (capabilityCoverage[capability.key] ?? []).length === 0,
      )
      .map((capability) => capability.key);

    return {
      systemKey: request.systemKey,
      components,
      capabilityCoverage,
      unresolvedCapabilities,
      generatedAt: new Date().toISOString(),
    };
  }

  private normalize(value: string): string {
    return value
      .trim()
      .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .toLowerCase();
  }
}
