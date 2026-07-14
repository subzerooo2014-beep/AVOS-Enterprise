import { Injectable } from "@nestjs/common";
@Injectable()
export class RuntimePolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) throw new Error("Invalid runtime input");
    return true;
  }
}
