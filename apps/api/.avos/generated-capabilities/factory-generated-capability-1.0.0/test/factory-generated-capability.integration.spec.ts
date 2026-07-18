import { Test } from "@nestjs/testing";
import { FactoryGeneratedCapabilityModule } from "../src/factory-generated-capability.module";

describe("FactoryGeneratedCapabilityModule integration", () => {
  it("compiles the generated capability module", async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [FactoryGeneratedCapabilityModule]
    }).compile();

    expect(moduleRef).toBeDefined();
    await moduleRef.close();
  });
});