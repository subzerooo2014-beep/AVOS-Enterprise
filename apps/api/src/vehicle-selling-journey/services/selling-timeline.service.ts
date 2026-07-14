import { Injectable } from "@nestjs/common";
import { SellingJourneyRecord, SellingStage } from "../vehicle-selling-journey.types";
@Injectable()
export class SellingTimelineService {
  add(record: SellingJourneyRecord, stage: SellingStage, note: string) {
    record.stage = stage;
    record.timeline.push({ stage, note, createdAt: new Date().toISOString() });
    record.updatedAt = new Date().toISOString();
    return record;
  }
}
