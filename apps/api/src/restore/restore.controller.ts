import { Body, Controller, Get, Post } from "@nestjs/common";
import { RestoreService } from "./restore.service";

@Controller("restore")
export class RestoreController{
 constructor(private service:RestoreService){}
 @Get() findAll(){ return this.service.findAll(); }
 @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
