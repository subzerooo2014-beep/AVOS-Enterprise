export class FactoryRuntimeSmokeCapabilityPayloadValidator {
  validate(payload: Record<string, unknown>): void {
    if (!payload || typeof payload !== "object") {
      throw new Error("Capability payload must be an object.");
    }

    if (Object.keys(payload).length === 0) {
      throw new Error("Capability payload cannot be empty.");
    }
  }
}