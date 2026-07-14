import { Injectable } from "@nestjs/common";

@Injectable()
export class VersioningPolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) {
      throw new Error("Invalid versioning input");
    }
    return true;
  }
}
