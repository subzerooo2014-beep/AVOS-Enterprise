import { Injectable } from '@nestjs/common';
import {
  IntegrationConnector,
  IntegrationPolicy,
} from './enterprise-integration-federation.types';

@Injectable()
export class IntegrationPolicyEngineService {
  evaluate(
    connectors: IntegrationConnector[],
    policies: IntegrationPolicy[],
  ) {
    const violations = connectors.flatMap((connector) =>
      policies.flatMap((policy) => {
        const items: string[] = [];

        if (connector.trustScore < policy.minimumTrustScore) {
          items.push(`${connector.id}:${policy.id}:trust`);
        }
        if (connector.latencyMs > policy.maximumLatencyMs) {
          items.push(`${connector.id}:${policy.id}:latency`);
        }
        if (!policy.allowedProtocols.includes(connector.protocol)) {
          items.push(`${connector.id}:${policy.id}:protocol`);
        }

        return items;
      }),
    );

    return {
      compliant: violations.length === 0,
      violations,
    };
  }
}