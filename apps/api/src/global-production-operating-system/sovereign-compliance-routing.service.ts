import { Injectable } from "@nestjs/common";
import { GlobalProductionOsStore } from "./global-production-os.store";
import {
  ComplianceEvaluation,
  GlobalFactoryNode,
  ProductionWorkload
} from "./global-production-os.types";

@Injectable()
export class SovereignComplianceRoutingService {
  constructor(private readonly store: GlobalProductionOsStore) {}

  evaluate(
    workload: ProductionWorkload,
    factory: GlobalFactoryNode
  ): ComplianceEvaluation {
    const reasons: string[] = [];
    let score = 100;

    if (workload.prohibitedCountries.includes(factory.countryCode)) {
      reasons.push("Destination country is explicitly prohibited.");
      score = 0;
    }

    if (!factory.sovereignDataClasses.includes(workload.dataClassification)) {
      reasons.push("Factory does not support the workload data classification.");
      score -= 60;
    }

    if (factory.status !== "operational") {
      reasons.push("Factory is not operational.");
      score -= 40;
    }

    if (factory.operationalCostIndex > workload.maximumCostIndex) {
      reasons.push("Factory exceeds maximum permitted cost index.");
      score -= 20;
    }

    if (factory.carbonIntensityIndex > workload.maximumCarbonIndex) {
      reasons.push("Factory exceeds maximum carbon index.");
      score -= 15;
    }

    const decision = score >= 75 ? "allowed" : score >= 45 ? "restricted" : "denied";
    const record: ComplianceEvaluation = {
      id: this.store.nextId("sovereign-compliance"),
      workloadId: workload.id,
      factoryId: factory.id,
      decision,
      score: Math.max(0, score),
      reasons: reasons.length > 0 ? reasons : ["All sovereign routing checks passed."],
      evaluatedAt: this.store.now()
    };
    this.store.complianceEvaluations.set(record.id, record);
    return record;
  }
}