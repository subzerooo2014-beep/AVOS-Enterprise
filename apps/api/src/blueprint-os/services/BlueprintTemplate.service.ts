import { Injectable } from "@nestjs/common";

@Injectable()
export class BlueprintTemplateService {
 status(){
   return {
      service:"BlueprintTemplateService",
      healthy:true,
      generatedAt:new Date().toISOString()
   };
 }
}
