import { Injectable } from "@nestjs/common";
import { auctionId } from "./auction-runtime.utils";
import { AuctionCreationPolicy } from "./policies/auction-creation.policy";
import { AuctionRepositoryService } from "./services/auction-repository.service";
import { AuctionTimelineService } from "./services/auction-timeline.service";
import { ParticipantService } from "./services/participant.service";
import { BidService } from "./services/bid.service";
import { AutoBidService } from "./services/auto-bid.service";
import { AuctionExtensionService } from "./services/auction-extension.service";
import { AuctionSettlementService } from "./services/auction-settlement.service";
import { AuctionAuditService } from "./services/auction-audit.service";

@Injectable()
export class AuctionRuntimeService {
  constructor(
    private readonly creationPolicy: AuctionCreationPolicy,
    private readonly repo: AuctionRepositoryService,
    private readonly timeline: AuctionTimelineService,
    private readonly participants: ParticipantService,
    private readonly bids: BidService,
    private readonly autoBid: AutoBidService,
    private readonly extension: AuctionExtensionService,
    private readonly settlement: AuctionSettlementService,
    private readonly audit: AuctionAuditService,
  ) {}

  create(input: {
    vehicleId: string;
    sellerId: string;
    title: string;
    reservePrice: number;
    startingPrice: number;
    minimumIncrement: number;
    startsAt: string;
    endsAt: string;
  }) {
    this.creationPolicy.validate(input);
    const now = new Date().toISOString();
    const record = {
      id: auctionId("auction"),
      ...input,
      currentPrice: input.startingPrice,
      status: "DRAFT" as const,
      bidIds: [],
      participantIds: [],
      timeline: [
        {
          status: "DRAFT" as const,
          note: "Auction created",
          createdAt: now,
        },
      ],
      createdAt: now,
      updatedAt: now,
    };
    this.repo.save(record);
    this.audit.record("AUCTION_CREATED", record.id);
    return record;
  }

  schedule(id: string) {
    const record = this.repo.get(id);
    this.timeline.add(record, "SCHEDULED", "Auction scheduled");
    return record;
  }

  start(id: string) {
    const record = this.repo.get(id);
    this.timeline.add(record, "LIVE", "Auction started");
    return record;
  }

  registerParticipant(id: string, input: {
    userId: string;
    trustScore: number;
    depositAmount: number;
  }) {
    const record = this.repo.get(id);
    const participant = this.participants.register({
      auctionId: id,
      ...input,
    });
    record.participantIds.push(String(participant.id));
    return { record, participant };
  }

  placeBid(id: string, input: {
    bidderId: string;
    amount: number;
  }) {
    const record = this.repo.get(id);
    const bid = this.bids.place({
      auctionId: id,
      bidderId: input.bidderId,
      amount: input.amount,
      currentPrice: record.currentPrice,
      minimumIncrement: record.minimumIncrement,
    });
    record.currentPrice = input.amount;
    record.highestBidId = String(bid.id);
    record.winnerId = input.bidderId;
    record.bidIds.push(String(bid.id));
    record.updatedAt = new Date().toISOString();
    this.audit.record("BID_PLACED", id, { bidId: bid.id });
    return { record, bid };
  }

  configureAutoBid(id: string, input: {
    bidderId: string;
    maximumAmount: number;
    increment?: number;
  }) {
    const record = this.repo.get(id);
    const rule = this.autoBid.configure({
      auctionId: id,
      currentPrice: record.currentPrice,
      ...input,
    });
    return { record, rule };
  }

  extend(id: string, seconds: number) {
    const record = this.repo.get(id);
    record.endsAt = this.extension.extend(record.endsAt, seconds);
    this.timeline.add(record, record.status, "Auction extended");
    return record;
  }

  end(id: string) {
    const record = this.repo.get(id);
    this.timeline.add(record, "ENDED", "Auction ended");
    return record;
  }

  settle(id: string, input: {
    paymentReference: string;
  }) {
    const record = this.repo.get(id);
    const settlement = this.settlement.settle({
      auctionId: id,
      winnerId: record.winnerId,
      paymentReference: input.paymentReference,
      amount: record.currentPrice,
    });
    this.timeline.add(record, "SETTLEMENT", "Auction settlement completed");
    this.timeline.add(record, "COMPLETED", "Auction completed");
    return { record, settlement };
  }

  get(id: string) { return this.repo.get(id); }
  list() { return this.repo.list(); }
}
