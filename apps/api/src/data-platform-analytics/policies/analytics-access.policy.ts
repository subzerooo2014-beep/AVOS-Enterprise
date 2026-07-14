import { Injectable } from "@nestjs/common";
@Injectable()
export class AnalyticsAccessPolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) throw new Error("Invalid analytics-access input");
    return true;
  }
}
