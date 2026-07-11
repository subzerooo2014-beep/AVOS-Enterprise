import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ListingsService } from "./listings.service";

@Controller("listings")
export class ListingsController{
 constructor(private service:ListingsService){}
 @Get() findAll(){ return this.service.findAll(); }
 @Post() create(@Body() dto:any){ return this.service.create(dto); }
 @Patch(":id") update(@Param("id") id:string,@Body() dto:any){ return this.service.update(id,dto); }
 @Delete(":id") remove(@Param("id") id:string){ return this.service.remove(id); }
}
