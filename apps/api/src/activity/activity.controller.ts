import { Body,Controller,Delete,Get,Param,Patch,Post } from "@nestjs/common";
import { ActivityService } from "./activity.service";

@Controller("activity")
export class ActivityController{

 constructor(private service:ActivityService){}

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
