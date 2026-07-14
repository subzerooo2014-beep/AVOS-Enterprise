import { Injectable } from "@nestjs/common";
@Injectable()
export class CommissionPolicy {
  calculate(amount: number, percent = 5) {
    if (amount <= 0) throw new Error("Invalid transaction amount");
    if (percent < 0 || percent > 100) throw new Error("Invalid commission percent");
    return Math.round(amount * (percent / 100) * 100) / 100;
  }
}
