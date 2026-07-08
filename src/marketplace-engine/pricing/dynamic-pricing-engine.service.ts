import { Injectable } from "@nestjs/common";

@Injectable()
export class DynamicPricingEngineService{
  calculate(vehicle:any){
    return{
      suggestedPrice:vehicle.price ?? null,
      confidence:90,
      strategy:"MARKET_AI",
    };
  }
}
