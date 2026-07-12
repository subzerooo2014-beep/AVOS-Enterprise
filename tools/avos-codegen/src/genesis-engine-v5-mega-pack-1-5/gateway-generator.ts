import {
  V5GatewayRoute,
  V5MicroserviceDefinition,
} from "./contracts";

export class V5ApiGatewayGenerator {
  generate(
    services: readonly V5MicroserviceDefinition[],
  ): V5GatewayRoute[] {
    return services.map((service) => ({
      path: `/api/${service.domainKey}`,
      targetService: service.key,
      methods: ["GET", "POST", "PATCH", "DELETE"],
      timeoutMs: 5000,
      retries: 2,
    }));
  }
}
