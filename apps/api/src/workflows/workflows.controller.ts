import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { WorkflowsService } from "./workflows.service";

@Controller("workflows")
export class WorkflowsController{
 constructor(private service:WorkflowsService){}
 @Get() findAll(){ return this.service.findAll(); }
 @Post() create(@Body() dto:any){ return this.service.create(dto); }
 @Patch(":id") update(@Param("id") id:string,@Body() dto:any){ return this.service.update(id,dto); }
 @Delete(":id") remove(@Param("id") id:string){ return this.service.remove(id); }
}
