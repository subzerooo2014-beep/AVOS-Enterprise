import { Injectable } from "@nestjs/common";
import { LifecycleRepositoryService } from "./lifecycle-repository.service";
import { MaintenanceService } from "./maintenance.service";
import { RecallService } from "./recall.service";
import { WarrantyService } from "./warranty.service";
@Injectable()
export class LifecycleDashboardService {
  constructor(private readonly lifecycle:LifecycleRepositoryService,private readonly maintenance:MaintenanceService,private readonly recalls:RecallService,private readonly warranties:WarrantyService){}
  summary(){return {lifecycles:this.lifecycle.list().length,maintenance:this.maintenance.list().length,recalls:this.recalls.list().length,warranties:this.warranties.list().length};}
}
