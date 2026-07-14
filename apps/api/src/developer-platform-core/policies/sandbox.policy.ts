import { Injectable } from "@nestjs/common";
@Injectable()
export class SandboxPolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) throw new Error("Invalid sandbox input");
    return true;
  }
}
