import { Injectable } from "@nestjs/common";
import { SecurityCatalogService } from "./security-catalog.service";
import { SecurityIncidentService } from "./security-incident.service";
import { SecurityPolicyRegistryService } from "./security-policy-registry.service";

@Injectable()
export class SecurityGovernanceService {
  constructor(
    private readonly catalog: SecurityCatalogService,
    private readonly policies: SecurityPolicyRegistryService,
    private readonly incidents: SecurityIncidentService,
  ) {}

  validate() {
    const violations: {
      code: string;
      component: string;
      message: string;
    }[] = [];

    for (const component of this.catalog.list()) {
      if (component.type === "UNKNOWN") {
        violations.push({
          code: "SECURITY_COMPONENT_UNKNOWN",
          component: component.id,
          message: "Security component type could not be classified.",
        });
      }
    }

    for (const policy of this.policies.list()) {
      if (!policy.version) {
        violations.push({
          code: "SECURITY_POLICY_VERSION_MISSING",
          component: policy.id,
          message: "Security policy version is missing.",
        });
      }
    }

    for (const incident of this.incidents.list()) {
      if (incident.severity === "CRITICAL" && incident.status !== "RESOLVED") {
        violations.push({
          code: "CRITICAL_SECURITY_INCIDENT_OPEN",
          component: incident.id,
          message: "Critical security incident remains open.",
        });
      }
    }

    return {
      compliant: violations.length === 0,
      score: Math.max(0, 100 - violations.length * 10),
      checkedAt: new Date().toISOString(),
      violations,
    };
  }
}
