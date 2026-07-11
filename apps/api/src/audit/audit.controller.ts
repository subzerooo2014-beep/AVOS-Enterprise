import { Body,Controller,Delete,Get,Param,Patch,Post } from "@nestjs/common";
import { AuditService } from "./audit.service";

@Controller("audit")
export class AuditController{

 constructor(private service:AuditService){}

 @Get()
 findAll(){
   return this.service.findAll();
 }

 @Get(":id")
 findOne(@Param("id") id:string){
   return this.service.findOne(id);
 }

 @Post()
 create(@Body() dto:any){
   return this.service.create(dto);
 }

 @Patch(":id")
 update(@Param("id") id:string,@Body() dto:any){
   return this.service.update(id,dto);
 }

 @Delete(":id")
 remove(@Param("id") id:string){
   return this.service.remove(id);
 }

}
