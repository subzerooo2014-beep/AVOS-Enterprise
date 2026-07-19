import { Injectable } from "@nestjs/common";

@Injectable()
export class KnowledgeSyncService{
  synchronize(payload?:any){
    return {
      success:true,
      component:"KnowledgeSyncService",
      executedAt:new Date().toISOString(),
      payload
    };
  }
}
