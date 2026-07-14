import { Injectable } from "@nestjs/common";
import { SaleCompletionPolicy } from "../policies/sale-completion.policy";
@Injectable()
export class SaleCompletionService {
  constructor(private readonly policy: SaleCompletionPolicy) {}
  complete(input: {
    journeyId: string;
    buyerId: string;
    finalPrice: number;
    paymentReference: string;
  }) {
    this.policy.validate(input.finalPrice, input.paymentReference);
    return {
      id: `sale_${Date.now()}`,
      ...input,
      status: "COMPLETED",
      completedAt: new Date().toISOString(),
    };
  }
}
