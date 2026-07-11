import { Injectable } from "@nestjs/common";

@Injectable()
export class DiscountEngineService {

 applyPercentage(
  price:number,
  percentage:number
 ){

  return price - (
    price * percentage / 100
  );

 }


 applyFixed(
  price:number,
  amount:number
 ){

  return price - amount;

 }

}
