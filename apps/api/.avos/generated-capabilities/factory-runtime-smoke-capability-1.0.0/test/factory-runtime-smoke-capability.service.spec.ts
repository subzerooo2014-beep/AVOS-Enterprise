import { FactoryRuntimeSmokeCapabilityService } from "../src/factory-runtime-smoke-capability.service";

describe("FactoryRuntimeSmokeCapabilityService", () => {
  let service: FactoryRuntimeSmokeCapabilityService;

  beforeEach(() => {
    service = new FactoryRuntimeSmokeCapabilityService();
  });

  it("returns healthy status", () => {
    expect(service.health()).toEqual(
      expect.objectContaining({
        status: "healthy",
        score: 100
      })
    );
  });

  it("executes a payload", () => {
    const result = service.execute({ sample: true });
    expect(result.success).toBe(true);
  });
});