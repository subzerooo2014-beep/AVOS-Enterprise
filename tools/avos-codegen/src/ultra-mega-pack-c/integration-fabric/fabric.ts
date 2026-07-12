import { randomUUID } from "node:crypto";
import {
  UltraCFinding,
  UltraCSeverity,
} from "../contracts";
import {
  IntegrationEndpoint,
  IntegrationFabricPlan,
  IntegrationRoute,
} from "./contracts";

export class UniversalIntegrationFabric {
  plan(
    endpoints: readonly IntegrationEndpoint[],
    requiredCapabilities: readonly string[],
  ): IntegrationFabricPlan {
    const routes: IntegrationRoute[] = [];
    const findings: UltraCFinding[] = [];
    const unresolvedCapabilities: string[] = [];

    for (const capability of requiredCapabilities) {
      const providers = endpoints.filter((endpoint) =>
        endpoint.capabilities.includes(capability),
      );

      if (providers.length < 2) {
        unresolvedCapabilities.push(capability);
        findings.push({
          code: "INSUFFICIENT_INTEGRATION_ENDPOINTS",
          severity: UltraCSeverity.WARNING,
          message:
            `Capability ${capability} does not have enough endpoints.`,
          subject: capability,
          metadata: { providerCount: providers.length },
        });
        continue;
      }

      for (let index = 0; index < providers.length - 1; index += 1) {
        const source = providers[index];
        const target = providers[index + 1];

        if (!source || !target) continue;

        routes.push({
          id: randomUUID(),
          key: `${source.key}-to-${target.key}-${capability}`,
          source: source.key,
          target: target.key,
          capability,
          controls: [
            "authentication",
            "authorization",
            "observability",
            "retry-policy",
          ],
        });
      }
    }

    return {
      routes,
      unresolvedCapabilities,
      findings,
      generatedAt: new Date().toISOString(),
    };
  }
}
