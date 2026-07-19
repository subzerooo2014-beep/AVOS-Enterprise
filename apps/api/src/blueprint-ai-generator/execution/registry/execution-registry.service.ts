import { Injectable } from "@nestjs/common";

@Injectable()
export class ExecutionRegistryService{
  track(payload?:any){
    return {
      success:true,
      component:"ExecutionRegistryService",
      executedAt:new Date().toISOString(),
      payload
    };
  }
}
