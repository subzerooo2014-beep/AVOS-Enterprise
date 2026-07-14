import { Injectable } from "@nestjs/common";

@Injectable()
export class PipelinePolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) {
      throw new Error("Invalid pipeline input");
    }
    return true;
  }
}
