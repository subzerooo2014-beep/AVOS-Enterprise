import { Body, Controller, Post } from "@nestjs/common";
import { PricingEngineService } from "./pricing-engine.service";

@Controller("pricing-engine")
export class PricingEngineController {

 constructor(
  private readonly service:PricingEngineService
 ){}

 @Post("calculate")
 calculate(
  @Body() dto:any
 ){

  return this.service.calculate(
    dto.basePrice,
    dto.adjustment ?? 0
  );

 }

}
