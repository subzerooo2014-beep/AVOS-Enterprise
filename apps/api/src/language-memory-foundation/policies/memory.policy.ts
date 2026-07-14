import { Injectable } from "@nestjs/common";

@Injectable()
export class MemoryPolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) {
      throw new Error("Invalid memory input");
    }
    return true;
  }
}
