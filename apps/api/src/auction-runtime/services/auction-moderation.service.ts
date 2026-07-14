import { Injectable } from "@nestjs/common";
@Injectable()
export class AuctionModerationService {
  moderate(action: string, notes?: string) {
    return { action, notes, status: "RECORDED", createdAt: new Date().toISOString() };
  }
}
