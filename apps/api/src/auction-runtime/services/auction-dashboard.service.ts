import { Injectable } from "@nestjs/common";
import { AuctionRepositoryService } from "./auction-repository.service";
import { BidService } from "./bid.service";
import { ParticipantService } from "./participant.service";
@Injectable()
export class AuctionDashboardService {
  constructor(
    private readonly repo: AuctionRepositoryService,
    private readonly bids: BidService,
    private readonly participants: ParticipantService,
  ) {}
  summary() {
    const auctions = this.repo.list();
    return {
      totalAuctions: auctions.length,
      liveAuctions: auctions.filter((item) => item.status === "LIVE").length,
      completedAuctions: auctions.filter((item) => item.status === "COMPLETED").length,
      totalBids: this.bids.list().length,
      totalParticipants: this.participants.list().length,
    };
  }
}
