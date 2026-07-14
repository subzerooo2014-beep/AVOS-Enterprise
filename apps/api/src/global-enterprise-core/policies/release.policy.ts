import { Injectable } from "@nestjs/common";

@Injectable()
export class ReleasePolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) {
      throw new Error("Invalid release input");
    }
    return true;
  }
}
