import { Injectable } from "@nestjs/common";

@Injectable()
export class TerminologyPolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) {
      throw new Error("Invalid terminology input");
    }
    return true;
  }
}
