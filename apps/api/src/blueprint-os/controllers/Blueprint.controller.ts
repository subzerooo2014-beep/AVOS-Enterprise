import { Controller,Get } from "@nestjs/common";
import { BlueprintRegistryService } from "../registry/BlueprintRegistry.service";

@Controller("blueprint")
export class BlueprintController{
 constructor(private readonly registry:BlueprintRegistryService){}
 @Get("status")
 status(){
   return {
      system:"AVOS Blueprint OS",
      status:"healthy",
      layer:"Platform",
      registry:this.registry.all().length
   };
 }
}
