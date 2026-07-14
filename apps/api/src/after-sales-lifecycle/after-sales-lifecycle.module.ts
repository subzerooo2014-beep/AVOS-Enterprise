import { Module } from "@nestjs/common";
import { AfterSalesLifecycleController } from "./after-sales-lifecycle.controller";
import { AfterSalesLifecycleService } from "./after-sales-lifecycle.service";
import { LifecyclePolicy } from "./policies/lifecycle.policy";
import { MaintenancePolicy } from "./policies/maintenance.policy";
import { WarrantyPolicy } from "./policies/warranty.policy";
import { RecallPolicy } from "./policies/recall.policy";
import { PartsPolicy } from "./policies/parts.policy";
import { RoadsidePolicy } from "./policies/roadside.policy";
import { RepairPolicy } from "./policies/repair.policy";
import { SubscriptionPolicy } from "./policies/subscription.policy";
import { LifecycleRepositoryService } from "./services/lifecycle-repository.service";
import { LifecycleService } from "./services/lifecycle.service";
import { MaintenanceService } from "./services/maintenance.service";
import { WarrantyService } from "./services/warranty.service";
import { WarrantyClaimService } from "./services/warranty-claim.service";
import { ServiceHistoryService } from "./services/service-history.service";
import { RecallService } from "./services/recall.service";
import { PartsInventoryService } from "./services/parts-inventory.service";
import { PartsOrderService } from "./services/parts-order.service";
import { RoadsideService } from "./services/roadside.service";
import { AccidentHistoryService } from "./services/accident-history.service";
import { RepairService } from "./services/repair.service";
import { OwnershipHistoryService } from "./services/ownership-history.service";
import { LifecycleSubscriptionService } from "./services/subscription.service";
import { LoyaltyService } from "./services/loyalty.service";
import { DealerNetworkService } from "./services/dealer-network.service";
import { LifecycleAlertService } from "./services/lifecycle-alert.service";
import { LifecycleReportingService } from "./services/lifecycle-reporting.service";
import { LifecycleAuditService } from "./services/lifecycle-audit.service";
import { LifecycleDashboardService } from "./services/lifecycle-dashboard.service";
import { LifecycleHealthService } from "./services/lifecycle-health.service";
import { LifecycleNotificationService } from "./services/lifecycle-notification.service";
import { LifecyclePredictiveMaintenanceEngine } from "./ai/predictive-maintenance.engine";
import { ResidualValueEngine } from "./ai/residual-value.engine";
import { WarrantyRiskEngine } from "./ai/warranty-risk.engine";
import { PartsDemandEngine } from "./ai/parts-demand.engine";
import { ServiceRecommendationEngine } from "./ai/service-recommendation.engine";
import { LifecycleHealthEngine } from "./ai/lifecycle-health.engine";
import { LoyaltyOptimizationEngine } from "./ai/loyalty-optimization.engine";
import { DealerNetworkEngine } from "./ai/dealer-network.engine";

@Module({
  controllers:[AfterSalesLifecycleController],
  providers:[
    AfterSalesLifecycleService,
    LifecyclePolicy,MaintenancePolicy,WarrantyPolicy,RecallPolicy,PartsPolicy,RoadsidePolicy,RepairPolicy,SubscriptionPolicy,
    LifecycleRepositoryService,LifecycleService,MaintenanceService,WarrantyService,WarrantyClaimService,ServiceHistoryService,RecallService,
    PartsInventoryService,PartsOrderService,RoadsideService,AccidentHistoryService,RepairService,OwnershipHistoryService,LifecycleSubscriptionService,
    LoyaltyService,DealerNetworkService,LifecycleAlertService,LifecycleReportingService,LifecycleAuditService,LifecycleDashboardService,
    LifecycleHealthService,LifecycleNotificationService,
    LifecyclePredictiveMaintenanceEngine,ResidualValueEngine,WarrantyRiskEngine,PartsDemandEngine,ServiceRecommendationEngine,LifecycleHealthEngine,
    LoyaltyOptimizationEngine,DealerNetworkEngine,
  ],
  exports:[AfterSalesLifecycleService],
})
export class AfterSalesLifecycleModule {}
