import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { AuctionV2Service } from "./auction-v2.service";

@Controller("auction-v2")
export class AuctionV2Controller {
  constructor(private readonly auctions: AuctionV2Service) {}

  @Post()
  create(
    @Body()
    body: {
      vehicleId?: string;
      title?: string;
      startingPrice?: number;
      reservePrice?: number;
      durationMinutes?: number;
    },
  ) {
    return this.auctions.create(body || {});
  }

  @Get()
  list() {
    return this.auctions.list();
  }

  @Get(":id")
  get(@Param("id") id: string) {
    return this.auctions.summary(id);
  }

  @Post(":id/bids")
  placeBid(
    @Param("id") id: string,
    @Body() body: { bidderId?: string; amount?: number },
  ) {
    return this.auctions.placeBid(
      id,
      body?.bidderId || "bidder-demo",
      Number(body?.amount ?? 0),
    );
  }

  @Post(":id/end")
  end(@Param("id") id: string) {
    return this.auctions.end(id);
  }

  @Post("smoke/run")
  smoke() {
    const auction = this.auctions.create({
      vehicleId: "vehicle-smoke-001",
      title: "AVOS Auction Smoke",
      startingPrice: 100000,
      reservePrice: 110000,
      durationMinutes: 30,
    });

    this.auctions.placeBid(auction.id, "bidder-1", 105000);
    this.auctions.placeBid(auction.id, "bidder-2", 115000);
    const ended = this.auctions.end(auction.id);
    const summary = this.auctions.summary(auction.id);

    return {
      success: ended.status === "ENDED" && summary.reserveMet && !!summary.winner,
      system: "AVOS Auction Mega Pack",
      integrationStatus: "running",
      auctionStatus: ended.status,
      bidCount: summary.bidCount,
      reserveMet: summary.reserveMet,
      winnerSelected: !!summary.winner,
      winningAmount: summary.winner?.amount ?? 0,
      capabilities: 6,
    };
  }
}