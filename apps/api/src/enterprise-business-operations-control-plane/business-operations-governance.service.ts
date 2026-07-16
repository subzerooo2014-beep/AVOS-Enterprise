import { Injectable } from "@nestjs/common";
import { BusinessCatalogService } from "./business-catalog.service";
import { BusinessKpiRegistryService } from "./business-kpi-registry.service";
import { BusinessRulesCenterService } from "./business-rules-center.service";
import { BusinessSlaMonitorService } from "./business-sla-monitor.service";

@Injectable()
export class BusinessOperationsGovernanceService {
  constructor(
    private readonly catalog: BusinessCatalogService,
    private readonly kpis: BusinessKpiRegistryService,
    private readonly rules: BusinessRulesCenterService,
    private readonly sla: BusinessSlaMonitorService,
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
          code: "BUSINESS_COMPONENT_UNKNOWN",
          component: component.id,
          message: "Business component type could not be classified.",
        });
      }
    }

    for (const kpi of this.kpis.definitionsList()) {
      if (!kpi.version) {
        violations.push({
          code: "BUSINESS_KPI_VERSION_MISSING",
          component: kpi.id,
          message: "Business KPI version is missing.",
        });
      }
    }

    for (const rule of this.rules.list()) {
      if (!rule.version) {
        violations.push({
          code: "BUSINESS_RULE_VERSION_MISSING",
          component: rule.id,
          message: "Business rule version is missing.",
        });
      }
    }

    for (const definition of this.sla.definitionsList()) {
      if (definition.warningMinutes > definition.targetMinutes) {
        violations.push({
          code: "BUSINESS_SLA_WARNING_INVALID",
          component: definition.id,
          message: "SLA warning threshold exceeds target threshold.",
        });
      }
    }

    return {
      compliant: violations.length === 0,
      score: Math.max(0, 100 - violations.length * 5),
      checkedAt: new Date().toISOString(),
      violations,
    };
  }
}
