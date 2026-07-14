import { Injectable } from "@nestjs/common";
@Injectable()
export class SlaPolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) throw new Error("Invalid sla input");
    return true;
  }
}
