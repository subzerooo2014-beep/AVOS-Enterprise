import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CoreFlowEnterpriseService } from "./core-flow-enterprise.service";
import { CoreFlowSlaService } from "./core-flow-sla.service";
import { CoreFlowCostService } from "./core-flow-cost.service";
import { CoreFlowLineageService } from "./core-flow-lineage.service";
import { CoreFlowRetentionService } from "./core-flow-retention.service";
import { CoreFlowPrivacyService } from "./core-flow-privacy.service";
import { CoreFlowChaosService } from "./core-flow-chaos.service";
import { CoreFlowContractService } from "./core-flow-contract.service";

@Controller("core-flow-enterprise")
export class CoreFlowEnterpriseController {
  constructor(
    private readonly enterprise: CoreFlowEnterpriseService,
    private readonly sla: CoreFlowSlaService,
    private readonly costs: CoreFlowCostService,
    private readonly lineage: CoreFlowLineageService,
    private readonly retention: CoreFlowRetentionService,
    private readonly privacy: CoreFlowPrivacyService,
    private readonly chaos: CoreFlowChaosService,
    private readonly contracts: CoreFlowContractService,
  ) {}

  @Post("preflight")
  preflight(@Body() dto: any) {
    return this.enterprise.preflight(dto);
  }

  @Post("finalize")
  finalize(@Body() dto: any) {
    return this.enterprise.finalize(dto);
  }

  @Post("sla")
  defineSla(@Body() dto: any) {
    return this.sla.define(
      dto?.flow,
      dto?.targetMs,
      dto?.warningMs,
      dto?.breachMs,
    );
  }

  @Post("sla/evaluate")
  evaluateSla(@Body() dto: any) {
    return this.sla.evaluate(dto?.flow, Number(dto?.durationMs ?? 0));
  }

  @Get("costs")
  costRecords() {
    return this.costs.findAll();
  }

  @Get("lineage/:executionId")
  lineageGraph(@Param("executionId") executionId: string) {
    return this.lineage.graph(executionId);
  }

  @Post("retention")
  createRetention(@Body() dto: any) {
    return this.retention.create(dto);
  }

  @Get("retention")
  retentionPolicies() {
    return this.retention.findAll();
  }

  @Post("retention/:id/deactivate")
  deactivateRetention(@Param("id") id: string) {
    return this.retention.deactivate(id);
  }

  @Post("privacy/redact")
  redact(@Body() dto: any) {
    return this.privacy.redact(dto?.payload ?? {});
  }

  @Post("chaos")
  createChaos(@Body() dto: any) {
    return this.chaos.create(dto);
  }

  @Get("chaos")
  chaosList() {
    return this.chaos.list();
  }

  @Post("chaos/:id/stop")
  stopChaos(@Param("id") id: string) {
    return this.chaos.stop(id);
  }

  @Post("contracts")
  registerContract(@Body() dto: any) {
    return this.contracts.register(
      dto?.name,
      Array.isArray(dto?.requiredFields) ? dto.requiredFields : [],
    );
  }

  @Get("contracts")
  contractsList() {
    return this.contracts.list();
  }

  @Get("dashboard")
  dashboard() {
    return this.enterprise.dashboard();
  }
}
