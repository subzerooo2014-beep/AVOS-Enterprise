import { Module } from "@nestjs/common";
import { OperationsFileStoreService } from "./operations-file-store.service";
import { EnvironmentManagementService } from "./environment-management.service";
import { RuntimeFleetManagementService } from "./runtime-fleet-management.service";
import { DeploymentControlService } from "./deployment-control.service";
import { ReleaseGovernanceService } from "./release-governance.service";
import { RollbackControlService } from "./rollback-control.service";
import { MaintenanceWindowService } from "./maintenance-window.service";
import { IncidentOperationsService } from "./incident-operations.service";
import { OperationsCommandCenterService } from "./operations-command-center.service";
import { UnifiedOperationsDashboardService } from "./unified-operations-dashboard.service";
import { PlatformProductionMegaPack3StatusService } from "./platform-production-mega-pack-3-status.service";
import { PlatformProductionMegaPack3AssuranceService } from "./platform-production-mega-pack-3-assurance.service";
import { PlatformProductionMegaPack3Controller } from "./platform-production-mega-pack-3.controller";

@Module({
  controllers: [PlatformProductionMegaPack3Controller],
  providers: [
    OperationsFileStoreService,
    EnvironmentManagementService,
    RuntimeFleetManagementService,
    DeploymentControlService,
    ReleaseGovernanceService,
    RollbackControlService,
    MaintenanceWindowService,
    IncidentOperationsService,
    OperationsCommandCenterService,
    UnifiedOperationsDashboardService,
    PlatformProductionMegaPack3StatusService,
    PlatformProductionMegaPack3AssuranceService,
  ],
  exports: [
    EnvironmentManagementService,
    RuntimeFleetManagementService,
    DeploymentControlService,
    ReleaseGovernanceService,
    RollbackControlService,
    MaintenanceWindowService,
    IncidentOperationsService,
    OperationsCommandCenterService,
    UnifiedOperationsDashboardService,
    PlatformProductionMegaPack3StatusService,
  ],
})
export class PlatformProductionMegaPack3Module {}