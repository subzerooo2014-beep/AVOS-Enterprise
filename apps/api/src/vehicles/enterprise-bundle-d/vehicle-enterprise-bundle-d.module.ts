import { Module } from "@nestjs/common";
import { VehicleFinanceReadinessService } from "./vehicle-finance-readiness.service";
import { VehicleInsuranceReadinessService } from "./vehicle-insurance-readiness.service";
import { VehicleExportReadinessService } from "./vehicle-export-readiness.service";
import { VehicleLogisticsReadinessService } from "./vehicle-logistics-readiness.service";
import { VehicleAuctionReadinessService } from "./vehicle-auction-readiness.service";
import { VehicleTradeInReadinessService } from "./vehicle-tradein-readiness.service";
import { VehicleWarrantyReadinessService } from "./vehicle-warranty-readiness.service";
import { VehicleServiceNetworkReadinessService } from "./vehicle-service-network-readiness.service";
import { VehicleTransferReadinessService } from "./vehicle-transfer-readiness.service";
import { VehicleDeliveryReadinessService } from "./vehicle-delivery-readiness.service";
import { VehicleCustomerHandoverService } from "./vehicle-customer-handover.service";
import { VehiclePostSaleIntelligenceService } from "./vehicle-postsale-intelligence.service";
import { VehicleRevenueAssuranceService } from "./vehicle-revenue-assurance.service";
import { VehicleTransactionOrchestratorService } from "./vehicle-transaction-orchestrator.service";
import { VehicleEnterpriseBundleDController } from "./vehicle-enterprise-bundle-d.controller";

@Module({
  controllers: [VehicleEnterpriseBundleDController],
  providers: [
    VehicleFinanceReadinessService,
    VehicleInsuranceReadinessService,
    VehicleExportReadinessService,
    VehicleLogisticsReadinessService,
    VehicleAuctionReadinessService,
    VehicleTradeInReadinessService,
    VehicleWarrantyReadinessService,
    VehicleServiceNetworkReadinessService,
    VehicleTransferReadinessService,
    VehicleDeliveryReadinessService,
    VehicleCustomerHandoverService,
    VehiclePostSaleIntelligenceService,
    VehicleRevenueAssuranceService,
    VehicleTransactionOrchestratorService,
  ],
  exports: [
    VehicleFinanceReadinessService,
    VehicleInsuranceReadinessService,
    VehicleExportReadinessService,
    VehicleLogisticsReadinessService,
    VehicleAuctionReadinessService,
    VehicleTradeInReadinessService,
    VehicleWarrantyReadinessService,
    VehicleServiceNetworkReadinessService,
    VehicleTransferReadinessService,
    VehicleDeliveryReadinessService,
    VehicleCustomerHandoverService,
    VehiclePostSaleIntelligenceService,
    VehicleRevenueAssuranceService,
    VehicleTransactionOrchestratorService,
  ],
})
export class VehicleEnterpriseBundleDModule {}
