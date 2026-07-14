import { Injectable } from "@nestjs/common";
import { CommissionPolicy } from "../policies/commission.policy";
@Injectable()
export class CommissionService {
  private readonly records: Array<Record<string, unknown>> = [];
  constructor(private readonly policy: CommissionPolicy) {}
  create(input: { entityId: string; transactionId: string; amount: number; commissionPercent?: number }) {
    const percent = input.commissionPercent ?? 5;
    const commissionAmount = this.policy.calculate(input.amount, percent);
    const record = {
      id: `commission_${Date.now()}`,
      ...input,
      commissionPercent: percent,
      commissionAmount,
      status: "DUE",
    };
    this.records.push(record);
    return record;
  }
  list() { return [...this.records]; }
}
