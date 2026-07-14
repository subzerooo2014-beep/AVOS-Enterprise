import { Injectable } from "@nestjs/common";
import { PurchaseJourneyRecord, PurchaseStage } from "../vehicle-purchase-journey.types";

@Injectable()
export class JourneyTimelineService {
  add(journey: PurchaseJourneyRecord, stage: PurchaseStage, note: string) {
    journey.stage = stage;
    journey.timeline.push({ stage, note, createdAt: new Date().toISOString() });
    journey.updatedAt = new Date().toISOString();
    return journey;
  }
}
