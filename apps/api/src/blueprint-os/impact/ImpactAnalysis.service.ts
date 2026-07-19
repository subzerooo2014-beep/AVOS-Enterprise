import { Injectable } from "@nestjs/common";

@Injectable()
export class ImpactAnalysisService{
 analyse(){
   return {
      impactedCapabilities:[],
      impactedProducts:[]
   };
 }
}
