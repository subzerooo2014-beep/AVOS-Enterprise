import { Body, Controller, Post } from "@nestjs/common";
import { TaxEngineService } from "./tax-engine.service";

@Controller("tax-engine")
export class TaxEngineController {

 constructor(
  private readonly service:TaxEngineService
 ){}

 @Post("calculate")
 calculate(
  @Body() dto:any
 ){

  return this.service.calculateTotal(
   dto.amount,
   dto.percentage
  );

 }

}
