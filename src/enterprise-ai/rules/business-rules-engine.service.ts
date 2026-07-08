import { Injectable } from "@nestjs/common";

@Injectable()
export class BusinessRulesEngineService {
  evaluate(rule:any,data:any){
    return {
      passed:true,
      rule,
      data,
    };
  }
}
