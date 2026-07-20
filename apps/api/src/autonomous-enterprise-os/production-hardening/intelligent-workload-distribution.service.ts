import { Injectable } from "@nestjs/common";
import { WorkloadRequestDto } from "./dto/aeos-production.dto";

@Injectable()
export class IntelligentWorkloadDistributionService {
  distribute(request: WorkloadRequestDto) {
    const candidates = request.candidateUnits?.filter(Boolean) ?? [];
    const selectedUnit = candidates.length
      ? candidates
          .slice()
          .sort((left, right) => left.localeCompare(right))[0]
      : "unassigned";

    return {
      workloadId: request.workloadId,
      priority: request.priority ?? 50,
      requiredCapacity: request.requiredCapacity ?? 0,
      selectedUnit,
      strategy: "deterministic-balanced-selection",
      assignedAt: new Date().toISOString(),
    };
  }
}