import { Controller, Get } from "@nestjs/common";

@Controller("blueprint/certification")
export class CertificationController{
 @Get("status")
 status(){
   return {
     healthy:true,
     subsystem:"Blueprint Certification Pipeline"
   };
 }
}
