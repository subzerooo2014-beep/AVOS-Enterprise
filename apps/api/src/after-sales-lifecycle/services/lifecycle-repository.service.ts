import { Injectable, NotFoundException } from "@nestjs/common";
import { VehicleLifecycleRecord } from "../after-sales-lifecycle.types";
@Injectable()
export class LifecycleRepositoryService {
  private readonly records=new Map<string,VehicleLifecycleRecord>();
  save(r:VehicleLifecycleRecord){this.records.set(r.id,r);return r;}
  get(id:string){const r=this.records.get(id);if(!r)throw new NotFoundException(`Lifecycle ${id} not found`);return r;}
  list(){return [...this.records.values()];}
}
