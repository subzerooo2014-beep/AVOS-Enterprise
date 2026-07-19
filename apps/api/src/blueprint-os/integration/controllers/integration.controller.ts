import { Controller, Get } from "@nestjs/common";

@Controller("blueprint/integration")
export class IntegrationController{
 @Get("status")
 status(){
   return {
     healthy:true,
     integrations:9
   };
 }
}
