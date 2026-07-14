import { Injectable } from "@nestjs/common";
@Injectable()
export class VersionPolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) throw new Error("Invalid version input");
    return true;
  }
}
