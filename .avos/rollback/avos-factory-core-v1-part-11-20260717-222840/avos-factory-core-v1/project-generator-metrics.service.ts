import { Injectable } from "@nestjs/common";
import {
  ProjectGenerationPlan,
  ProjectGeneratorMetricsSnapshot,
  ProjectValidationResult
} from "./project-generator.contracts";
import { ProjectGeneratorHistoryService } from "./project-generator-history.service";
import { ProjectKindRegistryService } from "./project-kind-registry.service";

@Injectable()
export class ProjectGeneratorMetricsService {
  private totalRequests = 0;
  private validRequests = 0;
  private invalidRequests = 0;
  private plannedProjects = 0;
  private approvalRequiredProjects = 0;
  private approvedProjects = 0;
  private rejectedProjects = 0;

  constructor(
    private readonly history: ProjectGeneratorHistoryService,
    private readonly kinds: ProjectKindRegistryService
  ) {}

  recordValidation(result: ProjectValidationResult): void {
    this.totalRequests += 1;
    result.valid ? this.validRequests += 1 : this.invalidRequests += 1;
  }

  recordPlan(plan: ProjectGenerationPlan): void {
    this.plannedProjects += 1;
    if (plan.requiresHumanApproval) this.approvalRequiredProjects += 1;
    if (plan.humanApproved) this.approvedProjects += 1;
  }

  recordRejected(): void { this.rejectedProjects += 1; }

  snapshot(): ProjectGeneratorMetricsSnapshot {
    return {
      totalRequests: this.totalRequests,
      validRequests: this.validRequests,
      invalidRequests: this.invalidRequests,
      plannedProjects: this.plannedProjects,
      approvalRequiredProjects: this.approvalRequiredProjects,
      approvedProjects: this.approvedProjects,
      rejectedProjects: this.rejectedProjects,
      historyRecords: this.history.count(),
      registeredProjectKinds: this.kinds.count(),
      calculatedAt: new Date().toISOString()
    };
  }
}
