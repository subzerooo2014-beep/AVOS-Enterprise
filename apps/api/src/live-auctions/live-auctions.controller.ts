import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { LiveAuctionsService } from "./live-auctions.service";
import {
  AuctionRecord,
  AuctionRecommendationRequest,
} from "./live-auctions.types";

@Controller("live-auctions")
export class LiveAuctionsController {
  constructor(private readonly auctions: LiveAuctionsService) {}

  @Get("capabilities")
  capabilities() {
    return this.auctions.capabilities();
  }

  @Post()
  createAuction(
    @Body()
    input: Omit<
      AuctionRecord,
      | "id"
      | "currentPrice"
      | "status"
      | "winnerBidId"
      | "createdAt"
      | "updatedAt"
    >,
  ) {
    return this.auctions.createAuction(input);
  }

  @Patch(":id/schedule")
  scheduleAuction(@Param("id") id: string) {
    return this.auctions.scheduleAuction(id);
  }

  @Patch(":id/start")
  startAuction(@Param("id") id: string) {
    return this.auctions.startAuction(id);
  }

  @Post(":id/bids")
  placeBid(
    @Param("id") id: string,
    @Body()
    body: {
      bidderId: string;
      amount: number;
      proxyMaximum?: number;
    },
  ) {
    return this.auctions.placeBid(
      id,
      body.bidderId,
      body.amount,
      body.proxyMaximum,
    );
  }

  @Post(":id/buy-now")
  buyNow(
    @Param("id") id: string,
    @Body() body: { bidderId: string },
  ) {
    return this.auctions.buyNow(id, body.bidderId);
  }

  @Patch(":id/end")
  endAuction(@Param("id") id: string) {
    return this.auctions.endAuction(id);
  }

  @Patch("moderation/bidders/:bidderId")
  moderateBidder(
    @Param("bidderId") bidderId: string,
    @Body() body: { blocked: boolean },
  ) {
    return this.auctions.moderateBidder(
      bidderId,
      body.blocked,
    );
  }

  @Get(":id/bids")
  bidHistory(@Param("id") id: string) {
    return this.auctions.bidHistory(id);
  }

  @Post("recommendations")
  recommend(@Body() request: AuctionRecommendationRequest) {
    return this.auctions.recommend(request);
  }

  @Get("analytics")
  analytics() {
    return this.auctions.analytics();
  }
}