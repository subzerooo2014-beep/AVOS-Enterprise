import { Controller,Post,Body } from "@nestjs/common";
import { RiskEngineService } from "./risk-engine.service";

@Controller("risk-engine")
export class RiskEngineController{
 constructor(private service:RiskEngineService){}
 @Post()
 analyze(@Body() dto:any){
   return this.service.analyze(dto);
 }
}
