import { Injectable } from "@nestjs/common";

@Injectable()
export class DirectionPolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) {
      throw new Error("Invalid direction input");
    }
    return true;
  }
}
