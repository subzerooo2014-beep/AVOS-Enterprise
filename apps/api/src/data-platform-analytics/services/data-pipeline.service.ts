import { Injectable } from "@nestjs/common";
@Injectable()
export class DataPipelineService {
  private readonly records: Array<Record<string, unknown>> = [];
  create(input: Record<string, unknown>) {
    const record = { id: "data-pipeline_"+Date.now(), ...input, createdAt: new Date().toISOString() };
    this.records.push(record);
    return record;
  }
  list() { return [...this.records]; }
}
