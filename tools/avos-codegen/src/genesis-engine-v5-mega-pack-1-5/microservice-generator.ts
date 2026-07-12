import {
  V5DistributedRuntimeInput,
  V5MicroserviceDefinition,
} from "./contracts";
import { v5Kebab, v5Pascal } from "./name-utils";

export class V5MicroserviceGenerator {
  generate(
    input: V5DistributedRuntimeInput,
  ): V5MicroserviceDefinition[] {
    return input.domains.map((domain, index) => ({
      key: `${v5Kebab(domain.key)}-service`,
      serviceName: `${v5Pascal(domain.entityName)} Service`,
      domainKey: domain.key,
      port: 4100 + index,
      capabilities: domain.capabilities,
      dependencies: domain.dependencies ?? [],
      healthEndpoint: "/health",
      readinessEndpoint: "/ready",
    }));
  }
}
