import { Injectable } from "@nestjs/common";
import {
  AvosFactorySynchronizationReport
} from "./avos-factory-synchronization.contracts";
import {
  AvosFactorySynchronizationOrchestratorService
} from "./avos-factory-synchronization-orchestrator.service";

@Injectable()
export class AvosFactorySynchronizationSmokeService {
  constructor(
    private readonly orchestrator:
      AvosFactorySynchronizationOrchestratorService
  ) {}

  run():
    AvosFactorySynchronizationReport {
    return this.orchestrator.synchronizeAll({
      actor:
        "system:part-11-smoke",
      approvedBy:
        "human:khalifa",
      humanApproved: true
    });
  }
}
