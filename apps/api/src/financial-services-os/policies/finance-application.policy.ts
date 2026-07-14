import { Injectable } from "@nestjs/common";
@Injectable()
export class FinanceApplicationPolicy {
  validate(amount:number,termMonths:number,income:number){
    if(amount<=0||termMonths<=0||income<=0) throw new Error("Invalid finance application");
    if(termMonths>120) throw new Error("Finance term too long");
    return true;
  }
}
