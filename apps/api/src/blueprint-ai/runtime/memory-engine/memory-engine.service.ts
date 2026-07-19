import { Injectable } from "@nestjs/common";

@Injectable()
export class MemoryEngineService{

 execute(context:any){
   return {
      module:"memory-engine",
      context,
      state:"running",
      executedAt:new Date().toISOString()
   };
 }

}
