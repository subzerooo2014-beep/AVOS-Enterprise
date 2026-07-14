import { Injectable } from "@nestjs/common";
@Injectable()
export class MarketplacePolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) throw new Error("Invalid marketplace input");
    return true;
  }
}
