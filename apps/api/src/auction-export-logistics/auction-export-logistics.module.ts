import { Module } from '@nestjs/common';
import { AuctionExportLogisticsController } from './auction-export-logistics.controller';
import { AuctionLifecycleEngineService } from './auction-lifecycle-engine.service';
import { LiveBiddingEngineService } from './live-bidding-engine.service';
import { ReservePriceValidationEngineService } from './reserve-price-validation-engine.service';
import { AuctionParticipantOperationsService } from './auction-participant-operations.service';
import { ExportEligibilityEngineService } from './export-eligibility-engine.service';
import { ShippingQuotationEngineService } from './shipping-quotation-engine.service';
import { CarrierCoordinationEngineService } from './carrier-coordination-engine.service';
import { CustomsDocumentationEngineService } from './customs-documentation-engine.service';
import { PortDestinationTrackingEngineService } from './port-destination-tracking-engine.service';
import { VehicleHandoverWorkflowService } from './vehicle-handover-workflow.service';
import { ExportPaymentSettlementEngineService } from './export-payment-settlement-engine.service';
import { AuctionExportOrchestratorService } from './auction-export-orchestrator.service';
import { AuctionExportDashboardService } from './auction-export-dashboard.service';

@Module({
  controllers: [AuctionExportLogisticsController],
  providers: [
    AuctionLifecycleEngineService,
    LiveBiddingEngineService,
    ReservePriceValidationEngineService,
    AuctionParticipantOperationsService,
    ExportEligibilityEngineService,
    ShippingQuotationEngineService,
    CarrierCoordinationEngineService,
    CustomsDocumentationEngineService,
    PortDestinationTrackingEngineService,
    VehicleHandoverWorkflowService,
    ExportPaymentSettlementEngineService,
    AuctionExportOrchestratorService,
    AuctionExportDashboardService,
  ],
  exports: [
    AuctionLifecycleEngineService,
    LiveBiddingEngineService,
    ReservePriceValidationEngineService,
    AuctionParticipantOperationsService,
    ExportEligibilityEngineService,
    ShippingQuotationEngineService,
    CarrierCoordinationEngineService,
    CustomsDocumentationEngineService,
    PortDestinationTrackingEngineService,
    VehicleHandoverWorkflowService,
    ExportPaymentSettlementEngineService,
    AuctionExportOrchestratorService,
    AuctionExportDashboardService,
  ],
})
export class AuctionExportLogisticsModule {}