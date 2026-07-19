import { Injectable } from "@nestjs/common";

@Injectable()
export class BlueprintAnalyzerService {
 status(){
   return {
      service:"BlueprintAnalyzerService",
      healthy:true,
      generatedAt:new Date().toISOString()
   };
 }
}
