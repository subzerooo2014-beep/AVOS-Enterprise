import { Injectable } from "@nestjs/common";
@Injectable()
export class DependencyPolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) throw new Error("Invalid dependency input");
    return true;
  }
}
