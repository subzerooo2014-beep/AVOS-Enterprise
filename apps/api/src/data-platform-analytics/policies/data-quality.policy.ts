import { Injectable } from "@nestjs/common";
@Injectable()
export class DataQualityPolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) throw new Error("Invalid data-quality input");
    return true;
  }
}
