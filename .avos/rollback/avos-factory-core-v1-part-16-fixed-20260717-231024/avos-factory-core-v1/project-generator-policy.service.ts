import { Injectable } from "@nestjs/common";
import { ProjectGeneratorPolicyDecision, ProjectGeneratorRequest } from "./project-generator.contracts";
import { ProjectKindRegistryService } from "./project-kind-registry.service";

@Injectable()
export class ProjectGeneratorPolicyService {
  private readonly blocked = new Set([
    "disable-authentication", "disable-authorization",
    "expose-secrets", "destructive-migration", "unrestricted-shell"
  ]);

  constructor(private readonly kinds: ProjectKindRegistryService) {}

  evaluate(request: ProjectGeneratorRequest): ProjectGeneratorPolicyDecision {
    const definition = this.kinds.resolve(request.kind);
    const features = request.features ?? [];
    const blockedFeatures = features.filter((feature) => this.blocked.has(feature));
    const unsupported = features.filter((feature) => !definition.supportedFeatures.includes(feature));
    const reasons: string[] = [];

    if (blockedFeatures.length) reasons.push(`Blocked features: ${blockedFeatures.join(", ")}.`);
    if (unsupported.length) reasons.push(`Unsupported features: ${unsupported.join(", ")}.`);

    return {
      allowed: blockedFeatures.length === 0 && unsupported.length === 0,
      requiresHumanApproval:
        definition.requiresHumanApproval ||
        request.overwrite === true ||
        features.includes("database") ||
        features.includes("authentication") ||
        features.includes("authorization"),
      reasons,
      blockedFeatures
    };
  }
}
