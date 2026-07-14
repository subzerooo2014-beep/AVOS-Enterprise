import { Injectable } from "@nestjs/common";
@Injectable()
export class OwnershipTransferPolicy {
  validate(input: { sellerId: string; buyerId: string; agreedPrice: number }) {
    if (input.sellerId === input.buyerId) throw new Error("Buyer and seller cannot match");
    if (input.agreedPrice <= 0) throw new Error("Invalid agreed price");
    return true;
  }
}
