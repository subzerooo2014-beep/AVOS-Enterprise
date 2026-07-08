import { Controller,Post,Body } from "@nestjs/common";
import { DecisionEngineService } from "./decision-engine.service";

@Controller("decision-engine")
export class DecisionEngineController{
 constructor(private service:DecisionEngineService){}
 @Post("evaluate")
 evaluate(@Body() dto:any){
   return this.service.evaluate(dto);
 }
}
