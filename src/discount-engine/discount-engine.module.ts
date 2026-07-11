import { Module } from "@nestjs/common";
import { DiscountEngineService } from "./discount-engine.service";
import { DiscountEngineController } from "./discount-engine.controller";

@Module({

 controllers:[
  DiscountEngineController
 ],

 providers:[
  DiscountEngineService
 ],

 exports:[
  DiscountEngineService
 ]

})
export class DiscountEngineModule {}
