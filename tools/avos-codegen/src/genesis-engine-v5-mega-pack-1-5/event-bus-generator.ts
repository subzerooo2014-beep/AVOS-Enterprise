import {
  V5DistributedRuntimeInput,
  V5EventContract,
  V5MicroserviceDefinition,
} from "./contracts";

export interface V5BrokerPlan {
  broker: string;
  topology: Array<{
    topic: string;
    partitions: number;
    durable: boolean;
  }>;
  deadLetterEnabled: boolean;
  retryPolicy: {
    attempts: number;
    backoffMs: number;
  };
}

export class V5EventBusGenerator {
  contracts(
    services: readonly V5MicroserviceDefinition[],
  ): V5EventContract[] {
    return services.flatMap((service) => [
      {
        key: `${service.domainKey}.created`,
        producer: service.key,
        consumers: services
          .filter((candidate) =>
            candidate.dependencies.includes(service.domainKey),
          )
          .map((candidate) => candidate.key),
        version: "1.0.0",
        payload: {
          id: "string",
          occurredAt: "string",
          correlationId: "string",
        },
      },
      {
        key: `${service.domainKey}.updated`,
        producer: service.key,
        consumers: services
          .filter((candidate) =>
            candidate.dependencies.includes(service.domainKey),
          )
          .map((candidate) => candidate.key),
        version: "1.0.0",
        payload: {
          id: "string",
          changes: "record",
          occurredAt: "string",
        },
      },
    ]);
  }

  brokerPlan(
    input: V5DistributedRuntimeInput,
    contracts: readonly V5EventContract[],
  ): V5BrokerPlan {
    return {
      broker: input.broker,
      topology: contracts.map((contract) => ({
        topic: contract.key,
        partitions: 3,
        durable: true,
      })),
      deadLetterEnabled: true,
      retryPolicy: {
        attempts: 5,
        backoffMs: 1000,
      },
    };
  }
}
