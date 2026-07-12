import {
  V5OmniInput,
  V5ScientificProgram,
} from "./contracts";

export class V5ScientificDiscoveryGenerator {
  generate(input: V5OmniInput): V5ScientificProgram[] {
    if (input.enableScientificDiscovery === false) return [];

    return input.scientificDomains.map((domain) => ({
      domain,
      hypotheses: [
        `optimize-${domain}`,
        `discover-new-${domain}-patterns`,
        `simulate-${domain}-interventions`,
      ],
      simulationRequired: true,
      approvalRequired: true,
    }));
  }

  knowledgeTransfer(input: V5OmniInput) {
    return {
      domains: input.scientificDomains,
      enterpriseNetworks: input.enterpriseNetworks,
      publicationRequired: true,
      reproducibilityRequired: true,
      controlledCommercializationEnabled: true,
    };
  }
}
