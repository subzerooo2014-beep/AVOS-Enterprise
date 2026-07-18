import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  AvosFactoryPromotionPolicy
} from "./avos-factory-deployment-governance.contracts";

@Injectable()
export class AvosFactoryPromotionPolicyRegistryService {
  private readonly policies: AvosFactoryPromotionPolicy[] = [];

  constructor() {
    this.seedDefaults();
  }

  register(
    input: Omit<AvosFactoryPromotionPolicy, "id" | "createdAt">
  ): AvosFactoryPromotionPolicy {
    const existing = this.policies.find(
      (policy) =>
        policy.sourceEnvironment === input.sourceEnvironment &&
        policy.targetEnvironment === input.targetEnvironment &&
        policy.name.toLowerCase() === input.name.toLowerCase()
    );

    if (existing) {
      return structuredClone(existing);
    }

    const policy: AvosFactoryPromotionPolicy = {
      id: randomUUID(),
      ...input,
      minimumCertificateScore: Math.max(
        0,
        Math.min(100, Math.round(input.minimumCertificateScore))
      ),
      maximumRiskScore: Math.max(
        0,
        Math.min(100, Math.round(input.maximumRiskScore))
      ),
      createdAt: new Date().toISOString()
    };

    this.policies.push(policy);
    return structuredClone(policy);
  }

  list(): AvosFactoryPromotionPolicy[] {
    return this.policies.map((policy) => structuredClone(policy));
  }

  resolve(
    sourceEnvironment: AvosFactoryPromotionPolicy["sourceEnvironment"],
    targetEnvironment: AvosFactoryPromotionPolicy["targetEnvironment"]
  ): AvosFactoryPromotionPolicy | undefined {
    const policy = this.policies.find(
      (candidate) =>
        candidate.enabled &&
        candidate.sourceEnvironment === sourceEnvironment &&
        candidate.targetEnvironment === targetEnvironment
    );

    return policy ? structuredClone(policy) : undefined;
  }

  private seedDefaults(): void {
    const defaults: Array<
      Omit<AvosFactoryPromotionPolicy, "id" | "createdAt">
    > = [
      {
        name: "Development to Testing",
        sourceEnvironment: "development",
        targetEnvironment: "testing",
        minimumCertificateScore: 80,
        requireReleaseApproval: false,
        requireHumanApproval: true,
        allowAutomaticRollback: true,
        maximumRiskScore: 50,
        enabled: true
      },
      {
        name: "Testing to Staging",
        sourceEnvironment: "testing",
        targetEnvironment: "staging",
        minimumCertificateScore: 85,
        requireReleaseApproval: true,
        requireHumanApproval: true,
        allowAutomaticRollback: true,
        maximumRiskScore: 35,
        enabled: true
      },
      {
        name: "Staging to Production",
        sourceEnvironment: "staging",
        targetEnvironment: "production",
        minimumCertificateScore: 90,
        requireReleaseApproval: true,
        requireHumanApproval: true,
        allowAutomaticRollback: true,
        maximumRiskScore: 20,
        enabled: true
      }
    ];

    for (const policy of defaults) {
      this.register(policy);
    }
  }
}
