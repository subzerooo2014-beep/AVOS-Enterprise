import { Injectable } from "@nestjs/common";

@Injectable()
export class BusinessIntelligenceService{
  dashboard(data:any){
    return{
      revenue:0,
      profit:0,
      customers:0,
      vehicles:0,
      insights:["BI Engine Ready"],
      data,
    };
  }
}
