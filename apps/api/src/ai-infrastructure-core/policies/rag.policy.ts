import { Injectable } from "@nestjs/common";
@Injectable()
export class RagPolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) throw new Error("Invalid rag input");
    return true;
  }
}
