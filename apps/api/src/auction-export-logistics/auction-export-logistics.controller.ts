import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateAuctionDto } from './dto/auction.dto';
import { PlaceBidDto } from './dto/bid.dto';
import { ShippingQuoteDto } from './dto/shipping-quote.dto';
import { AuctionLifecycleEngineService } from './auction-lifecycle-engine.service';
import { LiveBiddingEngineService } from './live-bidding-engine.service';
import { ShippingQuotationEngineService } from './shipping-quotation-engine.service';
import { AuctionExportDashboardService } from './auction-export-dashboard.service';
import { AUCTION_EXPORT_LOGISTICS_CAPABILITIES } from './auction-export-logistics.types';

@Controller('auction-export-logistics')
export class AuctionExportLogisticsController {
  constructor(
    private readonly auctions: AuctionLifecycleEngineService,
    private readonly bidding: LiveBiddingEngineService,
    private readonly shipping: ShippingQuotationEngineService,
    private readonly dashboard: AuctionExportDashboardService,
  ) {}

  @Get('capabilities')
  capabilities() {
    return {
      bundle:
        'Ultra Bundle U — Auctions, Export, Shipping & Logistics',
      count: AUCTION_EXPORT_LOGISTICS_CAPABILITIES.length,
      capabilities: AUCTION_EXPORT_LOGISTICS_CAPABILITIES,
    };
  }

  @Post('auctions')
  createAuction(@Body() input: CreateAuctionDto) {
    return this.auctions.create(input);
  }

  @Post('bids/evaluate')
  evaluateBids(
    @Body()
    input: {
      auction: CreateAuctionDto;
      bids: PlaceBidDto[];
    },
  ) {
    return this.bidding.evaluate(
      input.auction,
      input.bids.map((bid) => ({ ...bid, valid: true })),
    );
  }

  @Post('shipping/rank')
  rankShipping(@Body() input: { quotes: ShippingQuoteDto[] }) {
    return this.shipping.rank(input.quotes);
  }

  @Get('dashboard')
  dashboardSnapshot() {
    return this.dashboard.snapshot();
  }
}