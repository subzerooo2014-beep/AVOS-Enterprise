import { Injectable } from "@nestjs/common";
@Injectable()
export class AuctionCreationPolicy {
  validate(input: { reservePrice: number; startingPrice: number; startsAt: string; endsAt: string }) {
    if (input.reservePrice <= 0 || input.startingPrice <= 0) throw new Error("Invalid prices");
    if (new Date(input.endsAt) <= new Date(input.startsAt)) throw new Error("Invalid auction window");
    return true;
  }
}
