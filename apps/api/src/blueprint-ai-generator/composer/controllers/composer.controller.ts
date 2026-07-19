import { Controller, Get } from "@nestjs/common";

@Controller("blueprint-ai/composer")
export class ComposerController{
 @Get("status")
 status(){
   return {
     healthy:true,
     subsystem:"Artifact Composer",
     services:5
   };
 }
}
