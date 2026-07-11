import { Injectable } from "@nestjs/common";

@Injectable()
export class TaxEngineService {

 calculate(
  amount:number,
  percentage:number
 ){

  return amount * percentage / 100;

 }


 calculateTotal(
  amount:number,
  percentage:number
 ){

  return amount + this.calculate(
   amount,
   percentage
  );

 }

}
