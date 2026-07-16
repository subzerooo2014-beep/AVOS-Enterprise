import { Module } from "@nestjs/common";
import { BusinessCatalogService } from "./business-catalog.service";
import { BusinessKpiRegistryService } from "./business-kpi-registry.service";
import { BusinessOperationsAnalyticsService } from "./business-operations-analytics.service";
import { BusinessOperationsDiscoveryService } from "./business-operations-discovery.service";
import { BusinessOperationsGovernanceService } from "./business-operations-governance.service";
import { BusinessProcessOrchestratorService } from "./business-process-orchestrator.service";
import { BusinessRulesCenterService } from "./business-rules-center.service";
import { BusinessSlaMonitorService } from "./business-sla-monitor.service";
import { EnterpriseBusinessOperationsControlPlaneController } from "./enterprise-business-operations-control-plane.controller";
import { EnterpriseBusinessOperationsControlPlaneService } from "./enterprise-business-operations-control-plane.service";

@Module({
  controllers: [EnterpriseBusinessOperationsControlPlaneController],
  providers: [
    BusinessCatalogService,
    BusinessKpiRegistryService,
    BusinessOperationsAnalyticsService,
    BusinessOperationsDiscoveryService,
    BusinessOperationsGovernanceService,
    BusinessProcessOrchestratorService,
    BusinessRulesCenterService,
    BusinessSlaMonitorService,
    EnterpriseBusinessOperationsControlPlaneService,
  ],
  exports: [
    BusinessCatalogService,
    BusinessKpiRegistryService,
    BusinessOperationsAnalyticsService,
    BusinessOperationsDiscoveryService,
    BusinessOperationsGovernanceService,
    BusinessProcessOrchestratorService,
    BusinessRulesCenterService,
    BusinessSlaMonitorService,
    EnterpriseBusinessOperationsControlPlaneService,
  ],
})
export class EnterpriseBusinessOperationsControlPlaneModule {}
