import { Injectable } from "@nestjs/common";
import type { MeshRequest } from "../contracts/enterprise-intelligence-mesh.contracts";

@Injectable()
export class MeshPolicyService {
  evaluate(request: MeshRequest): {
    allowed: boolean;
    reasons: string[];
  } {
    const reasons: string[] = [];

    if (!request.context.identity.actorId.trim()) {
      reasons.push("Actor identity is required.");
    }

    if (!request.action.trim()) {
      reasons.push("Action is required.");
    }

    if (
      request.context.priority === "critical" &&
      request.context.identity.actorType === "agent" &&
      !request.context.identity.roles.includes("critical-operations")
    ) {
      reasons.push(
        "Critical agent operations require the critical-operations role."
      );
    }

    return {
      allowed: reasons.length === 0,
      reasons:
        reasons.length > 0
          ? reasons
          : ["Mesh request passed identity and execution policy checks."]
    };
  }
}