import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { BusinessCatalogService } from "./business-catalog.service";
import { BusinessKpiRegistryService } from "./business-kpi-registry.service";
import { BusinessProcessOrchestratorService } from "./business-process-orchestrator.service";
import { BusinessRulesCenterService } from "./business-rules-center.service";
import { BusinessSlaMonitorService } from "./business-sla-monitor.service";
import { EnterpriseBusinessOperationsControlPlaneService } from "./enterprise-business-operations-control-plane.service";
import type {
  BusinessKpiDefinition,
  BusinessRuleRecord,
  SlaDefinitionRecord,
} from "./enterprise-business-operations.types";

@Controller("enterprise-business-operations-control-plane")
export class EnterpriseBusinessOperationsControlPlaneController {
  constructor(
    private readonly controlPlane: EnterpriseBusinessOperationsControlPlaneService,
    private readonly catalog: BusinessCatalogService,
    private readonly kpis: BusinessKpiRegistryService,
    private readonly rules: BusinessRulesCenterService,
    private readonly processes: BusinessProcessOrchestratorService,
    private readonly sla: BusinessSlaMonitorService,
  ) {}

  @Get("status")
  status() {
    return this.controlPlane.health();
  }

  @Get("diagnostics")
  diagnostics() {
    return this.controlPlane.diagnostics();
  }

  @Post("catalog/refresh")
  refreshCatalog() {
    const items = this.catalog.refresh();
    return { success: true, discovered: items.length, items };
  }

  @Post("kpis")
  registerKpi(@Body() body: BusinessKpiDefinition) {
    return { success: true, kpi: this.kpis.register(body) };
  }

  @Post("kpis/:id/measure")
  measureKpi(
    @Param("id") id: string,
    @Body() body: { value: number; metadata?: Record<string, unknown> },
  ) {
    return {
      success: true,
      measurement: this.kpis.measure(id, body.value, body.metadata),
    };
  }

  @Post("rules")
  registerRule(@Body() body: BusinessRuleRecord) {
    return { success: true, rule: this.rules.register(body) };
  }

  @Post("processes/start")
  startProcess(
    @Body()
    body: {
      name: string;
      domain: string;
      steps: string[];
      context?: Record<string, unknown>;
    },
  ) {
    return {
      success: true,
      process: this.processes.start(
        body.name,
        body.domain,
        body.steps,
        body.context ?? {},
      ),
    };
  }

  @Post("processes/:id/advance")
  advanceProcess(@Param("id") id: string) {
    return { success: true, process: this.processes.advance(id) };
  }

  @Post("processes/:id/fail")
  failProcess(@Param("id") id: string, @Body() body: { error: string }) {
    return { success: true, process: this.processes.fail(id, body.error) };
  }

  @Post("slas")
  registerSla(@Body() body: SlaDefinitionRecord) {
    return { success: true, sla: this.sla.register(body) };
  }

  @Post("slas/:id/measure")
  measureSla(
    @Param("id") id: string,
    @Body() body: { processId: string; elapsedMinutes: number },
  ) {
    return {
      success: true,
      measurement: this.sla.measure(
        id,
        body.processId,
        body.elapsedMinutes,
      ),
    };
  }
}
