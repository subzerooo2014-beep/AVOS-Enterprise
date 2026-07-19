import { Injectable } from "@nestjs/common";

@Injectable()
export class BlueprintRuntimeService {
 status(){
   return {
      service:"BlueprintRuntimeService",
      healthy:true,
      generatedAt:new Date().toISOString()
   };
 }
}
