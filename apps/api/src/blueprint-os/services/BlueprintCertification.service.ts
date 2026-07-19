import { Injectable } from "@nestjs/common";

@Injectable()
export class BlueprintCertificationService {
 status(){
   return {
      service:"BlueprintCertificationService",
      healthy:true,
      generatedAt:new Date().toISOString()
   };
 }
}
