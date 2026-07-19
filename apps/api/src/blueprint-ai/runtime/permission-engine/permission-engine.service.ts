import { Injectable } from "@nestjs/common";

@Injectable()
export class PermissionEngineService{

 execute(context:any){
   return {
      module:"permission-engine",
      context,
      state:"running",
      executedAt:new Date().toISOString()
   };
 }

}
