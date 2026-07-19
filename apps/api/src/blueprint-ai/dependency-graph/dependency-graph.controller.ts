import { Controller, Get } from "@nestjs/common";
import { DependencyGraphService } from "./dependency-graph.service";

@Controller("dependency-graph")
export class DependencyGraphController{

 constructor(private readonly service:DependencyGraphService){}

 @Get("health")
 health(){
   return this.service.health();
 }

}
