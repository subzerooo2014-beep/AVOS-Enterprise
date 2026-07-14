import { Injectable } from "@nestjs/common";
@Injectable()
export class RetryPolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) throw new Error("Invalid retry input");
    return true;
  }
}
