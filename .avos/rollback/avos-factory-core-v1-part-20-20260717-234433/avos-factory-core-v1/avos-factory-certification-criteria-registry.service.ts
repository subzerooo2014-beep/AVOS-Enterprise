import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  AvosFactoryCertificationCriterion
} from "./avos-factory-certification-integration.contracts";

@Injectable()
export class AvosFactoryCertificationCriteriaRegistryService {
  private readonly criteria: AvosFactoryCertificationCriterion[] = [];

  constructor() {
    this.seedDefaults();
  }

  register(
    input: Omit<AvosFactoryCertificationCriterion, "id" | "createdAt">
  ): AvosFactoryCertificationCriterion {
    const existing = this.criteria.find(
      (criterion) =>
        criterion.name.toLowerCase() === input.name.toLowerCase()
    );

    if (existing) {
      return structuredClone(existing);
    }

    const criterion: AvosFactoryCertificationCriterion = {
      id: randomUUID(),
      ...input,
      minimumScore: Math.max(
        0,
        Math.min(100, Math.round(input.minimumScore))
      ),
      createdAt: new Date().toISOString()
    };

    this.criteria.push(criterion);
    return structuredClone(criterion);
  }

  list(): AvosFactoryCertificationCriterion[] {
    return this.criteria.map((criterion) => structuredClone(criterion));
  }

  private seedDefaults(): void {
    const defaults: Array<
      Omit<AvosFactoryCertificationCriterion, "id" | "createdAt">
    > = [
      {
        name: "Quality certification baseline",
        category: "quality",
        description: "Factory quality must satisfy the certification baseline.",
        minimumScore: 85,
        required: true
      },
      {
        name: "Validation certification baseline",
        category: "validation",
        description: "Validation controls must satisfy certification requirements.",
        minimumScore: 85,
        required: true
      },
      {
        name: "Security certification baseline",
        category: "security",
        description: "Security controls must satisfy certification requirements.",
        minimumScore: 90,
        required: true
      },
      {
        name: "Governance certification baseline",
        category: "governance",
        description: "Human Final Authority and audit controls must be complete.",
        minimumScore: 100,
        required: true
      },
      {
        name: "Operability certification baseline",
        category: "operability",
        description: "Factory output must be operationally ready.",
        minimumScore: 85,
        required: true
      },
      {
        name: "Documentation certification baseline",
        category: "documentation",
        description: "Documentation must support controlled release.",
        minimumScore: 80,
        required: true
      }
    ];

    for (const criterion of defaults) {
      this.register(criterion);
    }
  }
}
