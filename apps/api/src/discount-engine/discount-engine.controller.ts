import { Body, Controller, Post } from "@nestjs/common";
import { DiscountEngineService } from "./discount-engine.service";

@Controller("discount-engine")
export class DiscountEngineController {

 constructor(
  private readonly service:DiscountEngineService
 ){}

 @Post("apply")
 apply(
  @Body() dto:any
 ){

  return this.service.applyPercentage(
   dto.price,
   dto.discount
  );

 }

}
