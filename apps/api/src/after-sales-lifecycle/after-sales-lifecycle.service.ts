import { Injectable } from "@nestjs/common";
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

@Injectable()
export class AfterSalesLifecycleService {
  constructor(
    readonly lifecycle:LifecycleService,
    readonly maintenance:MaintenanceService,
    readonly warranties:WarrantyService,
    readonly warrantyClaims:WarrantyClaimService,
    readonly serviceHistory:ServiceHistoryService,
    readonly recalls:RecallService,
    readonly parts:PartsInventoryService,
    readonly partOrders:PartsOrderService,
    readonly roadside:RoadsideService,
    readonly accidents:AccidentHistoryService,
    readonly repairs:RepairService,
    readonly ownership:OwnershipHistoryService,
    readonly subscriptions:LifecycleSubscriptionService,
    readonly loyalty:LoyaltyService,
    readonly dealers:DealerNetworkService,
  ){}
}
