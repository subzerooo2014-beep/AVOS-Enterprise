import { Injectable } from "@nestjs/common";
import { GlobalFactoryRegistryService } from "./global-factory-registry.service";
import { SovereignComplianceRoutingService } from "./sovereign-compliance-routing.service";
import { GlobalProductionOsStore } from "./global-production-os.store";
import { ProductionWorkload, RoutingDecision } from "./global-production-os.types";

@Injectable()
export class GeoAwareOrchestrationService {
  constructor(
    private readonly store: GlobalProductionOsStore,
    private readonly registry: GlobalFactoryRegistryService,
    private readonly compliance: SovereignComplianceRoutingService
  ) {}

  createWorkload(
    input: Omit<ProductionWorkload, "id" | "status" | "humanDecision" | "createdAt" | "updatedAt">
  ): ProductionWorkload {
    const now = this.store.now();
    const workload: ProductionWorkload = {
      ...input,
      id: this.store.nextId("global-workload"),
      status: "created",
      humanDecision: input.requiresHumanApproval ? "pending" : "approved",
      createdAt: now,
      updatedAt: now
    };
    this.store.workloads.set(workload.id, workload);
    return workload;
  }

  route(workloadId: string): RoutingDecision {
    const workload = this.store.workloads.get(workloadId);
    if (!workload) throw new Error(`Workload not found: ${workloadId}`);

    const candidateScores = this.registry.list().map((factory) => {
      const evaluation = this.compliance.evaluate(workload, factory);
      const capabilityMatch = workload.requiredCapabilities.every((item) =>
        factory.capabilities.includes(item)
      ) ? 100 : 0;
      const capacityScore = factory.capacity - factory.currentLoad >= workload.requestedCapacity ? 100 : 0;
      const regionScore =
        workload.preferredRegions.length === 0 ||
        workload.preferredRegions.includes(factory.region)
          ? 100
          : 65;
      const costScore = Math.max(0, 100 - factory.operationalCostIndex);
      const carbonScore = Math.max(0, 100 - factory.carbonIntensityIndex);
      const totalScore =
        evaluation.score * 0.25 +
        capabilityMatch * 0.2 +
        capacityScore * 0.15 +
        regionScore * 0.1 +
        factory.healthScore * 0.1 +
        factory.trustScore * 0.1 +
        costScore * 0.05 +
        carbonScore * 0.05;

      return {
        factoryId: factory.id,
        totalScore: Number(totalScore.toFixed(2)),
        complianceDecision: evaluation.decision
      };
    });

    const eligible = candidateScores
      .filter((item) => item.complianceDecision === "allowed")
      .sort((a, b) => b.totalScore - a.totalScore);

    const selected = eligible[0];
    const decision: RoutingDecision = {
      id: this.store.nextId("geo-routing"),
      workloadId,
      selectedFactoryId: selected?.factoryId,
      candidateScores,
      status: selected ? "selected" : "blocked",
      requiresHumanApproval: workload.requiresHumanApproval,
      createdAt: this.store.now()
    };

    this.store.routingDecisions.set(decision.id, decision);

    if (selected) {
      workload.selectedFactoryId = selected.factoryId;
      workload.status = "routed";
      workload.updatedAt = this.store.now();
      this.store.workloads.set(workload.id, workload);
    }

    return decision;
  }

  approve(workloadId: string, approved: boolean): ProductionWorkload {
    const workload = this.store.workloads.get(workloadId);
    if (!workload) throw new Error(`Workload not found: ${workloadId}`);
    workload.humanDecision = approved ? "approved" : "rejected";
    workload.updatedAt = this.store.now();
    this.store.workloads.set(workload.id, workload);
    return workload;
  }
}