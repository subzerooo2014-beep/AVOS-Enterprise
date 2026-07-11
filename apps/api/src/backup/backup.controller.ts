import { Body, Controller, Get, Post } from "@nestjs/common";
import { BackupService } from "./backup.service";

@Controller("backup")
export class BackupController{
 constructor(private service:BackupService){}
 @Get() findAll(){ return this.service.findAll(); }
 @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
