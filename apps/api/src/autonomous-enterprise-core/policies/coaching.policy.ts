import { Injectable } from "@nestjs/common";

@Injectable()
export class CoachingPolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) {
      throw new Error("Invalid coaching input");
    }
    return true;
  }
}
