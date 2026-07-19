import { Injectable } from "@nestjs/common";

@Injectable()
export class RollbackEngineService{

 execute(context:any){
   return {
      module:"rollback-engine",
      context,
      state:"running",
      executedAt:new Date().toISOString()
   };
 }

}
