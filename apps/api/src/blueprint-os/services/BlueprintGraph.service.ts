import { Injectable } from "@nestjs/common";

@Injectable()
export class BlueprintGraphService {
 status(){
   return {
      service:"BlueprintGraphService",
      healthy:true,
      generatedAt:new Date().toISOString()
   };
 }
}
