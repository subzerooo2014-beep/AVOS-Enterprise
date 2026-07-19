import { Controller, Get } from "@nestjs/common";

@Controller("blueprint-ai")
export class BlueprintAIController{
 @Get("status")
 status(){
   return {
     healthy:true,
     subsystem:"Blueprint AI Generator",
     services:9
   };
 }
}
