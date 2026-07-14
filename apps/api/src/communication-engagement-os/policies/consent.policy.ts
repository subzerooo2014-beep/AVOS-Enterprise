import { Injectable } from "@nestjs/common";
@Injectable()
export class ConsentPolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) throw new Error("Invalid consent input");
    return true;
  }
}
