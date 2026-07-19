import { Controller, Get } from "@nestjs/common";
import { MetadataEngineService } from "./metadata-engine.service";

@Controller("metadata-engine")
export class MetadataEngineController{

 constructor(private readonly service:MetadataEngineService){}

 @Get("health")
 health(){
   return this.service.health();
 }

}
