import { Injectable } from "@nestjs/common";

@Injectable()
export class PricingEngineService {

 calculate(
  basePrice:number,
  adjustment:number = 0
 ){

  return basePrice + adjustment;

 }

 calculatePercentage(
  basePrice:number,
  percentage:number
 ){

  return basePrice - (
    basePrice * percentage / 100
  );

 }

}
