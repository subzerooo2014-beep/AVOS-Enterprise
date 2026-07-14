import { Injectable } from "@nestjs/common";
import { clamp, round } from "../ultra-ai-commerce.utils";

@Injectable()
export class NegotiationAiEngine {
  evaluate(input: { askingPrice: number; offerPrice: number; buyerTrust: number; sellerTrust: number; urgency?: number }) {
    const gap = ((input.askingPrice - input.offerPrice) / input.askingPrice) * 100;
    const trust = (input.buyerTrust + input.sellerTrust) / 2;
    const urgency = clamp(input.urgency ?? 50);
    const acceptanceScore = clamp(100 - gap * 3 + trust * 0.25 + urgency * 0.2);
    const counterOffer = round((input.askingPrice + input.offerPrice) / 2);
    return {
      acceptanceScore,
      recommendation: acceptanceScore >= 70 ? "ACCEPT" : acceptanceScore >= 45 ? "COUNTER" : "REJECT",
      counterOffer,
    };
  }
}
