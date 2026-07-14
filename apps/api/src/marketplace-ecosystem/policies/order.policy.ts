import { Injectable } from "@nestjs/common";
@Injectable()
export class OrderPolicy {
  validate(quantity: number, availableStock: number) {
    if (quantity <= 0) throw new Error("Invalid quantity");
    if (quantity > availableStock) throw new Error("Insufficient stock");
    return true;
  }
}
