import { FactoryGeneratedCapabilityService } from "../src/factory-generated-capability.service";

describe("FactoryGeneratedCapabilityService", () => {
  let service: FactoryGeneratedCapabilityService;

  beforeEach(() => {
    service = new FactoryGeneratedCapabilityService();
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