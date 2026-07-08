import { Injectable } from "@nestjs/common";

@Injectable()
export class DecisionEngineService{
  evaluate(data:any){
    return{
      approved:true,
      score:96,
    };
  }
}
