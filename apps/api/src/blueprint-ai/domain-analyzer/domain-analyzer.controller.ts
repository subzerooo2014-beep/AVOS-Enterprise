import { Controller, Get } from "@nestjs/common";
import { DomainAnalyzerService } from "./domain-analyzer.service";

@Controller("domain-analyzer")
export class DomainAnalyzerController{

 constructor(private readonly service:DomainAnalyzerService){}

 @Get("health")
 health(){
   return this.service.health();
 }

}
