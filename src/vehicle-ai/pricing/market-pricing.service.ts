import { Injectable } from "@nestjs/common";

@Injectable()
export class MarketPricingService{
 estimate(input:any){
  return{
   estimatedPrice:null,
   confidence:0,
   status:"WAITING_REAL_MARKET_PROVIDER",
   input,
  };
 }
}
