import { Injectable } from "@nestjs/common";
@Injectable()
export class AuctionExtensionService {
  extend(endsAt: string, seconds: number) {
    return new Date(new Date(endsAt).getTime() + seconds * 1000).toISOString();
  }
}
