import { Injectable } from "@nestjs/common";

@Injectable()
export class LearningPolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) {
      throw new Error("Invalid learning input");
    }
    return true;
  }
}
