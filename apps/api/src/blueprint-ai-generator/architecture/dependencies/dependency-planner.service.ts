import { Injectable } from "@nestjs/common";

@Injectable()
export class DependencyPlannerService{
  plan(input?:any){
    return {
      success:true,
      service:"DependencyPlannerService",
      timestamp:new Date().toISOString(),
      input
    };
  }
}
