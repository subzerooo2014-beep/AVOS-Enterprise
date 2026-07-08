import { Body,Controller,Get,Post } from "@nestjs/common";
import { TasksService } from "./tasks.service";

@Controller("tasks")
export class TasksController{
 constructor(private service:TasksService){}
 @Get() findAll(){ return this.service.findAll(); }
 @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
