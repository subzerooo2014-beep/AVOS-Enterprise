import { Injectable } from "@nestjs/common";
@Injectable()
export class LineagePolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) throw new Error("Invalid lineage input");
    return true;
  }
}
