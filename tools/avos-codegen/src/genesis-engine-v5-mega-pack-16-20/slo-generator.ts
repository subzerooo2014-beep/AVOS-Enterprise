import {
  V5OperationsInput,
  V5SloDefinition,
} from "./contracts";

export class V5SloGenerator {
  generate(input: V5OperationsInput): V5SloDefinition[] {
    return input.services.map((service) => {
      const availability =
        service.targetAvailability ??
        (service.criticality === "high"
          ? 99.95
          : service.criticality === "medium"
            ? 99.9
            : 99.5);

      return {
        serviceKey: service.key,
        availabilityTarget: availability,
        latencyTargetMs:
          service.targetLatencyMs ??
          (service.criticality === "high" ? 300 : 800),
        errorBudgetPercent: Number(
          (100 - availability).toFixed(3),
        ),
        measurementWindowDays: 30,
      };
    });
  }
}
