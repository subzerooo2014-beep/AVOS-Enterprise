import { Injectable } from '@nestjs/common';
import {
  Auction,
  AuctionBid,
  CustomsDocument,
  HandoverRecord,
  ShipmentTrackingEvent,
  ShippingQuote,
} from './auction-export-logistics.types';
import { LiveBiddingEngineService } from './live-bidding-engine.service';
import { ReservePriceValidationEngineService } from './reserve-price-validation-engine.service';
import { ShippingQuotationEngineService } from './shipping-quotation-engine.service';
import { CustomsDocumentationEngineService } from './customs-documentation-engine.service';
import { PortDestinationTrackingEngineService } from './port-destination-tracking-engine.service';
import { VehicleHandoverWorkflowService } from './vehicle-handover-workflow.service';
import { ExportPaymentSettlementEngineService } from './export-payment-settlement-engine.service';

@Injectable()
export class AuctionExportOrchestratorService {
  constructor(
    private readonly bidding: LiveBiddingEngineService,
    private readonly reserve: ReservePriceValidationEngineService,
    private readonly shipping: ShippingQuotationEngineService,
    private readonly customs: CustomsDocumentationEngineService,
    private readonly tracking: PortDestinationTrackingEngineService,
    private readonly handover: VehicleHandoverWorkflowService,
    private readonly settlement: ExportPaymentSettlementEngineService,
  ) {}

  run(input: {
    auction: Auction;
    bids: AuctionBid[];
    shippingQuotes: ShippingQuote[];
    documents: CustomsDocument[];
    trackingEvents: ShipmentTrackingEvent[];
    handover: HandoverRecord;
    customsAmount: number;
  }) {
    const bidding = this.bidding.evaluate(
      input.auction,
      input.bids,
    );
    const reserve = this.reserve.validate(
      input.auction,
      bidding.highestBid,
    );
    const shipping = this.shipping.rank(input.shippingQuotes);
    const customs = this.customs.validate(input.documents);
    const tracking = this.tracking.timeline(
      input.trackingEvents,
    );
    const handover = this.handover.evaluate(input.handover);

    const approved =
      reserve.reserveMet &&
      customs.ready &&
      handover.accepted &&
      shipping.length > 0;

    const settlement =
      approved && bidding.highestBid
        ? this.settlement.settle({
            auctionAmount: bidding.highestBid.amount,
            shippingAmount: shipping[0].totalAmount,
            customsAmount: input.customsAmount,
            platformFeeRate: 0.025,
          })
        : null;

    return {
      bidding,
      reserve,
      shipping,
      customs,
      tracking,
      handover,
      approved,
      settlement,
    };
  }
}