import { Injectable } from "@nestjs/common";

@Injectable()
export class ExecutiveDecisionService{
  decide(input:any){
    return{
      priority:"HIGH",
      decision:"PROCEED",
      confidence:97,
      input,
    };
  }
}
