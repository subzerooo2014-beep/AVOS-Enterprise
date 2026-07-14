import { Injectable } from "@nestjs/common";
import { RuntimeJobService } from "./job.service";
import { RuntimeWorkflowService } from "./workflow.service";
import { RuntimeTenantService } from "./tenant.service";
import { NotificationCenterService } from "./notification-center.service";
@Injectable()
export class OperationsDashboardService {
 constructor(private readonly jobs:RuntimeJobService,private readonly workflows:RuntimeWorkflowService,private readonly tenants:RuntimeTenantService,private readonly notifications:NotificationCenterService){}
 summary(){return {jobs:this.jobs.list().length,workflows:this.workflows.list().length,tenants:this.tenants.list().length,notifications:this.notifications.list().length};}
}
