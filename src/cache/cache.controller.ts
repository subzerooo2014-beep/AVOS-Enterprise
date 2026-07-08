import { Body,Controller,Delete,Get,Param,Patch,Post } from "@nestjs/common";
import { CacheService } from "./cache.service";

@Controller("cache")
export class CacheController{

 constructor(private service:CacheService){}

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
