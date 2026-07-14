import { Injectable } from "@nestjs/common";
@Injectable()
export class CapabilityRegistryService {
  private readonly records:Array<Record<string,unknown>>=[];
  create(input:Record<string,unknown>) {
    const record={id:"capability-registry_"+Date.now(),...input,createdAt:new Date().toISOString()};
    this.records.push(record);
    return record;
  }
  list(){return [...this.records];}
}
