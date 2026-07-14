import { Injectable } from "@nestjs/common";

@Injectable()
export class ConflictPolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) {
      throw new Error("Invalid conflict input");
    }
    return true;
  }
}
