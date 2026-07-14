import { Injectable } from "@nestjs/common";
import { PaymentPolicy } from "../policies/payment.policy";
@Injectable()
export class JourneyPaymentService {
  constructor(private readonly policy: PaymentPolicy) {}
  create(input: { journeyId: string; amount: number; method: string }) {
    this.policy.validate(input.amount);
    return { id: `pay_${Date.now()}`, ...input, status: "COMPLETED", createdAt: new Date().toISOString() };
  }
}
