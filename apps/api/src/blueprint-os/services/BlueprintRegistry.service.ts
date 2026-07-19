import { Injectable } from "@nestjs/common";

@Injectable()
export class BlueprintRegistryService {
 status(){
   return {
      service:"BlueprintRegistryService",
      healthy:true,
      generatedAt:new Date().toISOString()
   };
 }
}
