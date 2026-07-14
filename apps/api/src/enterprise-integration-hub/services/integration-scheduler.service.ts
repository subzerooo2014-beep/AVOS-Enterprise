import { Injectable } from "@nestjs/common";
@Injectable()
export class IntegrationSchedulerService {
  private readonly records:Array<Record<string,unknown>>=[];
  create(input:Record<string,unknown>) {
    const record={
      id:"integration-scheduler_"+Date.now(),
      ...input,
      createdAt:new Date().toISOString(),
    };
    this.records.push(record);
    return record;
  }
  list(){ return [...this.records]; }
}
