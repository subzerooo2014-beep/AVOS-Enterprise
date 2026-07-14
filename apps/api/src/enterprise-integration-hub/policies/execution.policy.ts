import { Injectable } from "@nestjs/common";
@Injectable()
export class ExecutionPolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) throw new Error("Invalid execution input");
    return true;
  }
}
