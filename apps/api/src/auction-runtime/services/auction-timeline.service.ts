import { Injectable } from "@nestjs/common";
import { AuctionRecord, AuctionStatus } from "../auction-runtime.types";
@Injectable()
export class AuctionTimelineService {
  add(record: AuctionRecord, status: AuctionStatus, note: string) {
    record.status = status;
    record.timeline.push({ status, note, createdAt: new Date().toISOString() });
    record.updatedAt = new Date().toISOString();
    return record;
  }
}
