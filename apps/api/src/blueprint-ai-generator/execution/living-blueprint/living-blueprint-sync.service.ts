import { Injectable } from "@nestjs/common";

@Injectable()
export class LivingBlueprintSyncService{
  sync(payload?:any){
    return {
      success:true,
      component:"LivingBlueprintSyncService",
      executedAt:new Date().toISOString(),
      payload
    };
  }
}
