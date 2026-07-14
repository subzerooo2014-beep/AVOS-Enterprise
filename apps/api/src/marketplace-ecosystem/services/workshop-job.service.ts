import { Injectable } from "@nestjs/common";
@Injectable()
export class WorkshopJobService {
  private readonly records: Array<Record<string, unknown>> = [];
  create(input: Record<string, unknown>) {
    const record = { id: `workshop_job_${Date.now()}`, ...input, status: "OPEN" };
    this.records.push(record);
    return record;
  }
  list() { return [...this.records]; }
}
