import { Injectable } from "@nestjs/common";

@Injectable()
export class InsightEngineService{
  generate(data:any){
    return{
      insights:[
        "Sales trending upward",
        "Inventory turnover improving",
        "Lead conversion stable"
      ],
    };
  }
}
