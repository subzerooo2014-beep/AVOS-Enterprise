import { Injectable } from "@nestjs/common";
@Injectable()
export class SalikProvider {
  account(accountNumber: string) {
    return {
      accountNumber,
      status: "ACTIVE",
      vehicles: [],
      simulated: true,
    };
  }
  balance(accountNumber: string) {
    return {
      accountNumber,
      balance: 125.5,
      currency: "AED",
      simulated: true,
    };
  }
}
