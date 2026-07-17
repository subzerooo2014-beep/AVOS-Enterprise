import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import {
  ArchitectureChangeRequest,
  ChangeImpactReport,
  RiskLevel,
} from "../contracts/architecture-intelligence.contracts";
import {
  ArchitectureApprovalDto,
  ProposeArchitectureChangeDto,
} from "../dto/architecture-intelligence.dto";
import { ArchitectureRegistryService } from "./architecture-registry.service";

@Injectable()
export class ChangeImpactService {
  private readonly requests = new Map<string, ArchitectureChangeRequest>();
  private sequence = 0;

  constructor(private readonly registry: ArchitectureRegistryService) {}

  propose(input: ProposeArchitectureChangeDto): ArchitectureChangeRequest {
    this.registry.get(input.componentId);

    if (
      (input.changeType === "add-dependency" || input.changeType === "remove-dependency") &&
      !input.targetComponentId
    ) {
      throw new BadRequestException("targetComponentId is required for dependency changes");
    }

    if (input.targetComponentId) {
      this.registry.get(input.targetComponentId);
    }

    const request: ArchitectureChangeRequest = {
      id: `architecture-change:${Date.now()}:${++this.sequence}`,
      componentId: input.componentId,
      changeType: input.changeType,
      description: input.description.trim(),
      proposedVersion: input.proposedVersion,
      targetComponentId: input.targetComponentId,
      requestedBy: input.requestedBy ?? "AVOS Architecture Intelligence",
      humanApprovalRequired: true,
      status: "proposed",
      createdAt: new Date().toISOString(),
    };

    this.requests.set(request.id, request);
    return request;
  }

  list(): readonly ArchitectureChangeRequest[] {
    return [...this.requests.values()];
  }

  get(id: string): ArchitectureChangeRequest {
    const request = this.requests.get(id);
    if (!request) throw new NotFoundException(`Architecture change request not found: ${id}`);
    return request;
  }

  approve(id: string, input: ArchitectureApprovalDto): ArchitectureChangeRequest {
    const request = this.get(id);
    if (!input.approvedBy?.trim()) {
      throw new BadRequestException("approvedBy is required");
    }

    const updated: ArchitectureChangeRequest = {
      ...request,
      status: input.approved ? "approved" : "rejected",
    };

    this.requests.set(id, updated);
    return updated;
  }

  analyze(id: string): ChangeImpactReport {
    const request = this.get(id);
    const direct = this.registry.dependentsOf(request.componentId);
    const transitive = this.registry.transitiveDependentsOf(request.componentId);
    const compatibilityRisks: string[] = [];

    if (request.changeType === "remove") {
      compatibilityRisks.push("Removing this component can break all registered dependents.");
    }

    if (request.changeType === "upgrade" && !request.proposedVersion) {
      compatibilityRisks.push("Upgrade request has no proposed target version.");
    }

    if (request.changeType === "add-dependency" && request.targetComponentId === request.componentId) {
      compatibilityRisks.push("A component cannot depend on itself.");
    }

    const impactCount = new Set([...direct, ...transitive].map((component) => component.id)).size;
    const riskLevel: RiskLevel =
      compatibilityRisks.length > 0 && impactCount > 2 ? "critical" :
      compatibilityRisks.length > 0 ? "high" :
      impactCount > 3 ? "high" :
      impactCount > 0 ? "medium" :
      "low";

    return {
      id: `architecture-impact:${Date.now()}`,
      changeRequestId: request.id,
      componentId: request.componentId,
      directlyImpacted: direct.map((component) => component.id),
      transitivelyImpacted: transitive.map((component) => component.id),
      compatibilityRisks,
      governanceRequirements: [
        "Human architecture approval is required before execution.",
        "Audit the final decision and preserve decision traceability.",
        "Re-run architecture analysis after the approved change.",
      ],
      riskLevel,
      humanApprovalRequired: true,
      recommendations: [
        "Validate all dependent contracts before implementation.",
        "Prepare rollback instructions before deployment.",
        "Execute the change through governed release controls.",
      ],
      generatedAt: new Date().toISOString(),
    };
  }
}