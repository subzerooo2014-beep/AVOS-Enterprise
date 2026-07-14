import { Injectable } from "@nestjs/common";
@Injectable()
export class CompatibilityPolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) throw new Error("Invalid compatibility input");
    return true;
  }
}
