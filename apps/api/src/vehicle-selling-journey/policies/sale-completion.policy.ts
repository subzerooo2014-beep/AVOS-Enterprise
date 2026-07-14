import { Injectable } from "@nestjs/common";
@Injectable()
export class SaleCompletionPolicy {
  validate(finalPrice: number, paymentReference: string) {
    if (finalPrice <= 0 || !paymentReference) throw new Error("Invalid sale completion data");
    return true;
  }
}
