import { Controller, Get, Post } from "@nestjs/common";
import { CertificationEngineService } from "./certification-engine.service";
import { InspectionEngineService } from "./inspection-engine.service";
import { InspectionPluginRegistryService } from "./inspection-plugin-registry.service";
import { InspectionPolicyService } from "./inspection-policy.service";
import { InspectionReportService } from "./inspection-report.service";
import { InspectionRuntimeService } from "./inspection-runtime.service";

@Controller("inspection-certification")
export class InspectionCertificationController {
  constructor(
    private readonly inspectionEngine: InspectionEngineService,
    private readonly certificationEngine: CertificationEngineService,
    private readonly runtime: InspectionRuntimeService,
    private readonly pluginRegistry: InspectionPluginRegistryService,
    private readonly policy: InspectionPolicyService,
    private readonly reports: InspectionReportService,
  ) {}

  @Get("status")
  status() {
    return {
      system: "AVOS Inspection & Certification OS",
      version: "1.6.0",
      phase: "Mega Pack A (IC-3 to IC-6)",
      status: "healthy",
      pluginCount: this.pluginRegistry.list().length,
      nonDestructive: true,
      humanFinalAuthority: true,
      cleanupSystemSeparated: true,
    };
  }

  @Get("rules")
  rules() {
    return {
      count: this.inspectionEngine.listRules().length,
      rules: this.inspectionEngine.listRules(),
    };
  }

  @Get("plugins")
  plugins() {
    const plugins = this.pluginRegistry.list();

    return {
      count: plugins.length,
      enabled: plugins.filter((plugin) => plugin.enabled).length,
      plugins: plugins.map((plugin) => ({
        id: plugin.id,
        name: plugin.name,
        version: plugin.version,
        category: plugin.category,
        severity: plugin.severity,
        priority: plugin.priority,
        enabled: plugin.enabled,
        dependencies: plugin.dependencies,
      })),
    };
  }

  @Post("inspect/foundation")
  inspectFoundation() {
    const results = this.inspectionEngine.runFoundationInspection();

    return {
      status: "completed",
      resultCount: results.length,
      results,
    };
  }

  @Post("runtime/execute")
  executeRuntime() {
    return this.runtime.execute();
  }

  @Post("reports/enterprise")
  async enterpriseReport() {
    const runtime = await this.runtime.execute();
    const policy = this.policy.evaluate(runtime.results);

    return this.reports.create(runtime, policy);
  }

  @Post("certify/foundation")
  certifyFoundation() {
    return this.certificationEngine.certifyFoundation();
  }
}
