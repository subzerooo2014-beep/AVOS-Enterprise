import { Injectable } from "@nestjs/common";

@Injectable()
export class KpiIntelligenceService {
  analyze(kpis:any){
    return {
      health:"GOOD",
      risks:[],
      opportunities:["Improve conversion rate","Reduce aged stock"],
      kpis,
    };
  }
}
