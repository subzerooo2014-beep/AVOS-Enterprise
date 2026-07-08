import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { IntegrationsService } from "./integrations.service";

@Controller("integrations")
export class IntegrationsController{
 constructor(private service:IntegrationsService){}
 @Get() findAll(){ return this.service.findAll(); }
 @Post() create(@Body() dto:any){ return this.service.create(dto); }
 @Patch(":id") update(@Param("id") id:string,@Body() dto:any){ return this.service.update(id,dto); }
 @Delete(":id") remove(@Param("id") id:string){ return this.service.remove(id); }
}
