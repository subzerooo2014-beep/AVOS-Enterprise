import { Injectable } from "@nestjs/common";
@Injectable()
export class AuctionSchedulerService {
  schedule(startsAt: string, endsAt: string) {
    return { startsAt, endsAt, scheduled: true };
  }
}
