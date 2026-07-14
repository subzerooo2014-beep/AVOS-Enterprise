import { Injectable } from "@nestjs/common";

@Injectable()
export class AuditPolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) {
      throw new Error("Invalid audit input");
    }
    return true;
  }
}
