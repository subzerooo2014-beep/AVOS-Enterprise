import { Injectable } from "@nestjs/common";

@Injectable()
export class PrivacyPolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) {
      throw new Error("Invalid privacy input");
    }
    return true;
  }
}
