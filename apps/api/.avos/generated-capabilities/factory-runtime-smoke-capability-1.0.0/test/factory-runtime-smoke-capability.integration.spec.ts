import { Test } from "@nestjs/testing";
import { FactoryRuntimeSmokeCapabilityModule } from "../src/factory-runtime-smoke-capability.module";

describe("FactoryRuntimeSmokeCapabilityModule integration", () => {
  it("compiles the generated capability module", async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [FactoryRuntimeSmokeCapabilityModule]
    }).compile();

    expect(moduleRef).toBeDefined();
    await moduleRef.close();
  });
});