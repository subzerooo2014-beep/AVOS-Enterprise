import { Module } from "@nestjs/common";
import { TaxEngineService } from "./tax-engine.service";
import { TaxEngineController } from "./tax-engine.controller";

@Module({

 controllers:[
  TaxEngineController
 ],

 providers:[
  TaxEngineService
 ],

 exports:[
  TaxEngineService
 ]

})
export class TaxEngineModule {}
