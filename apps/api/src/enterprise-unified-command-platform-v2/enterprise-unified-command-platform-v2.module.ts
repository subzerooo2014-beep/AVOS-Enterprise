import { Module } from "@nestjs/common";
import { CommandApprovalV2Service } from "./command-approval-v2.service";
import { CommandSourceRegistryV2Service } from "./command-source-registry-v2.service";
import { EnterpriseUnifiedCommandPlatformV2Controller } from "./enterprise-unified-command-platform-v2.controller";
import { EnterpriseUnifiedCommandPlatformV2Service } from "./enterprise-unified-command-platform-v2.service";
import { ExecutiveCockpitV2Service } from "./executive-cockpit-v2.service";
import { GlobalMonitoringV2Service } from "./global-monitoring-v2.service";
import { UnifiedCommandOrchestratorV2Service } from "./unified-command-orchestrator-v2.service";

@Module({
  controllers: [EnterpriseUnifiedCommandPlatformV2Controller],
  providers: [
    CommandApprovalV2Service,
    CommandSourceRegistryV2Service,
    EnterpriseUnifiedCommandPlatformV2Service,
    ExecutiveCockpitV2Service,
    GlobalMonitoringV2Service,
    UnifiedCommandOrchestratorV2Service,
  ],
  exports: [
    CommandApprovalV2Service,
    CommandSourceRegistryV2Service,
    EnterpriseUnifiedCommandPlatformV2Service,
    ExecutiveCockpitV2Service,
    GlobalMonitoringV2Service,
    UnifiedCommandOrchestratorV2Service,
  ],
})
export class EnterpriseUnifiedCommandPlatformV2Module {}
