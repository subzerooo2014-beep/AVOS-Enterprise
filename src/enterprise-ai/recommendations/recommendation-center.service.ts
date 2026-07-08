import { Injectable } from "@nestjs/common";

@Injectable()
export class RecommendationCenterService{
  generate(data:any){
    return{
      recommendations:[
        "Increase marketing budget",
        "Review aging inventory",
        "Contact premium customers"
      ],
    };
  }
}
