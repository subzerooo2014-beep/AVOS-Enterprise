import { Injectable } from "@nestjs/common";
@Injectable()
export class DataPipelinePolicy {
  validate(input: Record<string, unknown>) {
    if (!input || Object.keys(input).length === 0) throw new Error("Invalid data-pipeline input");
    return true;
  }
}
