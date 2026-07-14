import { Injectable } from "@nestjs/common";
import { NegotiationPolicy } from "../policies/negotiation.policy";
@Injectable()
export class JourneyNegotiationService {
  constructor(private readonly policy: NegotiationPolicy) {}
  submit(input: { askingPrice: number; actor: string; amount: number; message?: string; accept?: boolean }) {
    this.policy.validate(input.askingPrice, input.amount);
    return { id: `offer_${Date.now()}`, ...input, createdAt: new Date().toISOString() };
  }
}
