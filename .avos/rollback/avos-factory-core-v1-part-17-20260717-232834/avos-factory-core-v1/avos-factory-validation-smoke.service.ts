import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import {
  AvosFactoryValidationSmokeReport
} from "./avos-factory-validation.contracts";
import {
  AvosFactoryGenerationAnalyzerService
} from "./avos-factory-generation-analyzer.service";
import {
  AvosFactoryValidationRuleRegistryService
} from "./avos-factory-validation-rule-registry.service";
import {
  AvosFactoryValidationEngineService
} from "./avos-factory-validation-engine.service";
import {
  AvosFactoryQualityGateService
} from "./avos-factory-quality-gate.service";
import {
  AvosFactoryDefectRegistryService
} from "./avos-factory-defect-registry.service";
import {
  AvosFactoryComplianceReportingService
} from "./avos-factory-compliance-reporting.service";

@Injectable()
export class AvosFactoryValidationSmokeService {
  constructor(
    private readonly analyzer: AvosFactoryGenerationAnalyzerService,
    private readonly rules: AvosFactoryValidationRuleRegistryService,
    private readonly validation: AvosFactoryValidationEngineService,
    private readonly gates: AvosFactoryQualityGateService,
    private readonly defects: AvosFactoryDefectRegistryService,
    private readonly compliance: AvosFactoryComplianceReportingService
  ) {}

  run(): AvosFactoryValidationSmokeReport {
    const subjectId = `part-14-smoke:${Date.now()}`;

    this.analyzer.analyze({
      subjectId,
      actor: "system:part-14-smoke",
      source: "smoke",
      success: true,
      durationMs: 900,
      filesGenerated: 10,
      warnings: [],
      failures: [],
      reusedCapabilities: [
        "capability:factory-validation",
        "capability:factory-quality"
      ],
      templateId: "template:validation-smoke",
      blueprintId: "blueprint:validation-smoke",
      quality: {
        architecture: 95,
        maintainability: 93,
        scalability: 92,
        security: 96,
        documentation: 90,
        reliability: 95,
        reuse: 94
      }
    });

    const report = this.validation.validate({
      subjectId,
      actor: "system:part-14-smoke",
      governanceScore: 100
    });

    const gate = this.gates.create({
      subjectId,
      reportId: report.id,
      minimumScore: 80
    });

    const defects = this.defects.createFromReport(report.id);
    const summary = this.compliance.summarize(subjectId);

    const checks = {
      ruleRegistry: this.rules.list(true).length >= 8,
      validationEngine: Boolean(report.id),
      validationPassed: report.passed,
      qualityGate: gate.status === "passed",
      defectRegistry: Array.isArray(defects),
      complianceReporting: summary.complianceScore >= 80,
      productionReadiness: summary.productionReady,
      humanFinalAuthority:
        gate.humanApproved === false &&
        gate.approvedBy === undefined
    };

    const blockingFindings = Object.entries(checks)
      .filter(([, passed]) => !passed)
      .map(([name]) => name);

    const score = Math.round(
      (
        Object.values(checks).filter(Boolean).length /
        Object.keys(checks).length
      ) * 100
    );

    return {
      id: randomUUID(),
      success: score === 100 && blockingFindings.length === 0,
      score,
      checks,
      blockingFindings,
      generatedAt: new Date().toISOString()
    };
  }
}
