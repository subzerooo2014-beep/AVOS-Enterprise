import { Injectable } from "@nestjs/common";
@Injectable()
export class JourneyContractService {
  create(input: { journeyId: string; buyerAccepted: boolean; sellerAccepted: boolean }) {
    return { id: `contract_${Date.now()}`, ...input, status: input.buyerAccepted && input.sellerAccepted ? "SIGNED" : "PENDING" };
  }
}
