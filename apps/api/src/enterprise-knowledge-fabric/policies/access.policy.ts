import { Injectable } from "@nestjs/common";
@Injectable()
export class AccessPolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) {
      throw new Error("Invalid access input");
    }
    return true;
  }
}
