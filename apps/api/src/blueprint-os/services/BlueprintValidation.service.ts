import { Injectable } from "@nestjs/common";

@Injectable()
export class BlueprintValidationService {
 status(){
   return {
      service:"BlueprintValidationService",
      healthy:true,
      generatedAt:new Date().toISOString()
   };
 }
}
