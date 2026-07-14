import { Injectable } from "@nestjs/common";

@Injectable()
export class SharedMemoryPolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) {
      throw new Error("Invalid shared-memory input");
    }
    return true;
  }
}
