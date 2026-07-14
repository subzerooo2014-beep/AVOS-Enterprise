import { Injectable } from "@nestjs/common";
@Injectable()
export class KnowledgePolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) {
      throw new Error("Invalid knowledge input");
    }
    return true;
  }
}
