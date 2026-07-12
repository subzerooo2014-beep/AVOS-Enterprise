import {
  V5DistributedRuntimeInput,
  V5SagaDefinition,
} from "./contracts";

export class V5SagaGenerator {
  generate(
    input: V5DistributedRuntimeInput,
  ): V5SagaDefinition[] {
    if (input.enableSaga === false) return [];

    const domainKeys = input.domains.map((domain) => domain.key);

    if (
      !domainKeys.includes("orders") ||
      !domainKeys.includes("payments")
    ) {
      return [];
    }

    return [
      {
        key: "order-payment-saga",
        trigger: "orders.created",
        steps: [
          {
            service: "payments-service",
            action: "authorize-payment",
            compensation: "void-payment",
          },
          {
            service: "orders-service",
            action: "confirm-order",
            compensation: "cancel-order",
          },
        ],
      },
    ];
  }
}
