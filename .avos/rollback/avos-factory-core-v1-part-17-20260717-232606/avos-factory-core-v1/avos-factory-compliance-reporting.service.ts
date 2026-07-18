import { Injectable } from "@nestjs/common";
import {
  AvosFactoryComplianceSummary
} from "./avos-factory-validation.contracts";
import {
  AvosFactoryValidationRuleRegistryService
} from "./avos-factory-validation-rule-registry.service";
import {
  AvosFactoryValidationEngineService
} from "./avos-factory-validation-engine.service";

@Injectable()
export class AvosFactoryComplianceReportingService {
  constructor(
    private readonly rules: AvosFactoryValidationRuleRegistryService,
    private readonly validation: AvosFactoryValidationEngineService
  ) {}

  summarize(subjectId: string): AvosFactoryComplianceSummary {
    const report = this.validation.latestForSubject(subjectId);
    const ruleCount = this.rules.list(true).length;
    const passedRules = report?.passedRules ?? 0;
    const failedRules = report?.failedRules ?? ruleCount;
    const waivedRules =
      report?.findings.filter((finding) => finding.status === "waived").length ?? 0;

    const complianceScore =
      ruleCount === 0
        ? 0
        : Math.max(
            0,
            Math.min(
              100,
              Math.round(((passedRules + waivedRules) / ruleCount) * 100)
            )
          );

    return {
      subjectId,
      ruleCount,
      passedRules,
      failedRules,
      waivedRules,
      complianceScore,
      productionReady:
        Boolean(report?.passed) &&
        complianceScore >= 80 &&
        (report?.blockingFindings ?? 1) === 0,
      generatedAt: new Date().toISOString()
    };
  }
}
