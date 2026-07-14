import { Injectable } from "@nestjs/common";
@Injectable()
export class VectorPolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) throw new Error("Invalid vector input");
    return true;
  }
}
