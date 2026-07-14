import { Injectable } from "@nestjs/common";
@Injectable()
export class ProvenancePolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) {
      throw new Error("Invalid provenance input");
    }
    return true;
  }
}
