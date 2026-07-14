import { Injectable } from "@nestjs/common";
@Injectable()
export class UpgradePolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) throw new Error("Invalid upgrade input");
    return true;
  }
}
