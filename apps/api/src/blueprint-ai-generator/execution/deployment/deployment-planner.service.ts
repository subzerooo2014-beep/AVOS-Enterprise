import { Injectable } from "@nestjs/common";

@Injectable()
export class DeploymentPlannerService{
  plan(payload?:any){
    return {
      success:true,
      component:"DeploymentPlannerService",
      executedAt:new Date().toISOString(),
      payload
    };
  }
}
