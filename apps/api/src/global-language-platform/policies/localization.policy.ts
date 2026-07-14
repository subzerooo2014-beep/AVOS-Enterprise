import { Injectable } from "@nestjs/common";

@Injectable()
export class LocalizationPolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) {
      throw new Error("Invalid localization input");
    }
    return true;
  }
}
