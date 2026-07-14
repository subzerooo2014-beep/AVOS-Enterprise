import { Injectable } from "@nestjs/common";
@Injectable()
export class FinancialRiskEngine {
  evaluate(input:{income:number;liabilities:number;creditScore:number;requestedAmount:number}){
    const debtRatio=input.income?input.liabilities/input.income:1;
    let risk=(1-Math.min(1,input.creditScore/850))*45+Math.min(40,debtRatio*40)+Math.min(15,input.requestedAmount/100000);
    risk=Math.max(0,Math.min(100,Math.round(risk)));
    return {risk,decision:risk>=70?"REJECT":risk>=45?"REVIEW":"APPROVE"};
  }
}
