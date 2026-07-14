import { Injectable } from "@nestjs/common";

@Injectable()
export class StatePolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) {
      throw new Error("Invalid state input");
    }
    return true;
  }
}
