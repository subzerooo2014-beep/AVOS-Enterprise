import { Injectable } from "@nestjs/common";

@Injectable()
export class AdaptiveGrowthScalabilityService {
  assess(input: {
    expectedRequestsPerSecond?: number;
    expectedConcurrentWorkflows?: number;
  } = {}) {
    const rps = input.expectedRequestsPerSecond ?? 100;
    const workflows = input.expectedConcurrentWorkflows ?? 50;

    return {
      status: "ready",
      expectedRequestsPerSecond: rps,
      expectedConcurrentWorkflows: workflows,
      statelessApiReady: true,
      horizontalScalingReady: true,
      queuePartitioningReady: true,
      distributedPersistenceRequiredForScaleOut: true,
      recommendedReplicas: Math.max(2, Math.ceil(rps / 250)),
    };
  }

  status() {
    return this.assess();
  }
}