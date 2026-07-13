import { Injectable } from "@nestjs/common";
import { CoreFlowTenancyService } from "./core-flow-tenancy.service";
import { CoreFlowSlaService } from "./core-flow-sla.service";
import { CoreFlowCostService } from "./core-flow-cost.service";
import { CoreFlowLineageService } from "./core-flow-lineage.service";
import { CoreFlowRetentionService } from "./core-flow-retention.service";
import { CoreFlowPrivacyService } from "./core-flow-privacy.service";
import { CoreFlowChaosService } from "./core-flow-chaos.service";
import { CoreFlowContractService } from "./core-flow-contract.service";

@Injectable()
export class CoreFlowEnterpriseService {
  constructor(
    private readonly tenancy: CoreFlowTenancyService,
    private readonly sla: CoreFlowSlaService,
    private readonly costs: CoreFlowCostService,
    private readonly lineage: CoreFlowLineageService,
    private readonly retention: CoreFlowRetentionService,
    private readonly privacy: CoreFlowPrivacyService,
    private readonly chaos: CoreFlowChaosService,
    private readonly contracts: CoreFlowContractService,
  ) {}

  preflight(dto: any) {
    const tenant = this.tenancy.validate(dto?.tenant ?? {});
    const contract = dto?.contractName
      ? this.contracts.validate(dto.contractName, dto?.payload ?? {})
      : null;
    const classification = this.privacy.classify(dto?.payload ?? {});
    const redactedPayload = this.privacy.redact(dto?.payload ?? {});

    return {
      tenant,
      contract,
      classification,
      redactedPayload,
      approved:
        (!contract || contract.valid) &&
        classification.classification !== "restricted",
      evaluatedAt: new Date().toISOString(),
    };
  }

  finalize(dto: any) {
    const cost = this.costs.record(
      dto?.executionId,
      dto?.flow,
      dto?.units ?? 1,
      dto?.unitCost ?? 0,
      dto?.currency ?? "AED",
    );

    const lineage = this.lineage.record(
      dto?.executionId,
      dto?.source ?? "unknown",
      dto?.target ?? "unknown",
      dto?.transformation ?? "pass-through",
    );

    const sla = dto?.durationMs !== undefined
      ? this.sla.evaluate(dto?.flow, Number(dto.durationMs))
      : null;

    return {
      cost,
      lineage,
      sla,
      finalizedAt: new Date().toISOString(),
    };
  }

  dashboard() {
    return {
      costs: this.costs.dashboard(),
      serviceLevels: this.sla.list(),
      retentionPolicies: this.retention.findAll(),
      contracts: this.contracts.list(),
      chaosExperiments: this.chaos.list(),
      generatedAt: new Date().toISOString(),
    };
  }
}
