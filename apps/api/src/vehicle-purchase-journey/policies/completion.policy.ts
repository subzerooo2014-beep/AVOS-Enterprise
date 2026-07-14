import { Injectable } from "@nestjs/common";
import { PurchaseJourneyRecord } from "../vehicle-purchase-journey.types";
@Injectable()
export class CompletionPolicy {
  canComplete(journey: PurchaseJourneyRecord) {
    return Boolean(journey.paymentId && journey.contractId && journey.transferId && journey.deliveryId);
  }
}
