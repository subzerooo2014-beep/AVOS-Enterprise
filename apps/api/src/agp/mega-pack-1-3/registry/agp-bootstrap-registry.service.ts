import { Injectable } from "@nestjs/common";
import { AgpRegistryService } from "./agp-registry.service";

@Injectable()
export class AgpBootstrapRegistryService {
  constructor(private readonly registry: AgpRegistryService) {}

  bootstrap() {
    const capabilities = [
      "Strategy Management",
      "OKR Management",
      "KPI Management",
      "Growth Planning",
      "Opportunity Discovery",
      "Market Intelligence",
      "Recommendation Intelligence",
      "Growth Governance",
    ];

    const services = [
      "AGP Runtime",
      "AGP Registry",
      "AGP Event Bus",
      "Strategy Service",
      "Planning Service",
      "Growth Brain",
      "Opportunity Radar",
      "Growth Memory",
      "Governance Service",
      "Health Service",
      "Verification Service",
      "Certification Service",
    ];

    const engines = [
      "Growth Brain",
      "Strategy Intelligence Engine",
      "Opportunity Radar",
      "Recommendation Engine",
      "Executive Decision Engine",
      "Growth Memory Engine",
    ];

    const integrations = [
      "Enterprise Kernel",
      "Capability Fabric",
      "Knowledge Fabric",
      "Intelligence Fabric",
      "Unified Platform Suite",
    ];

    capabilities.forEach((name) =>
      this.registry.register({
        type: "capability",
        name,
        version: "1.0.0",
        dependencies: [],
      }),
    );

    services.forEach((name) =>
      this.registry.register({
        type: "service",
        name,
        version: "1.0.0",
        dependencies: [],
      }),
    );

    engines.forEach((name) =>
      this.registry.register({
        type: "engine",
        name,
        version: "1.0.0",
        dependencies: ["Intelligence Fabric", "Knowledge Fabric"],
      }),
    );

    integrations.forEach((name) =>
      this.registry.register({
        type: "integration",
        name,
        version: "1.0.0",
        dependencies: [],
      }),
    );

    return this.registry.snapshot();
  }
}