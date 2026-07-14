import { Injectable } from "@nestjs/common";
@Injectable()
export class FuelPolicy {
  validate(liters: number, cost: number) {
    if (liters <= 0 || cost <= 0) throw new Error("Invalid fuel transaction");
    return true;
  }
}
