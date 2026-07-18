import { Injectable } from "@nestjs/common";

@Injectable()
export class TestStrategyPlannerService {
  create(capabilityName: string) {
    return {
      capabilityName,
      layers: [
        {
          type: "unit",
          required: true,
          objective: "Validate isolated business behavior"
        },
        {
          type: "integration",
          required: true,
          objective: "Validate module and dependency contracts"
        },
        {
          type: "smoke",
          required: true,
          objective: "Validate runtime readiness"
        },
        {
          type: "regression",
          required: true,
          objective: "Protect existing factory capabilities"
        }
      ],
      coverageTarget: 90,
      deterministic: true,
      score: 100
    };
  }
}
