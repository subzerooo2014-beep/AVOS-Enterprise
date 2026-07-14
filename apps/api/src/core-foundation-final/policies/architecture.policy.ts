import { Injectable } from "@nestjs/common";

@Injectable()
export class ArchitecturePolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) {
      throw new Error("Invalid architecture input");
    }
    return true;
  }
}
