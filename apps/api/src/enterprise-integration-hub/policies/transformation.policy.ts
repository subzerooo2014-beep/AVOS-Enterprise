import { Injectable } from "@nestjs/common";
@Injectable()
export class TransformationPolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) throw new Error("Invalid transformation input");
    return true;
  }
}
