import { Body,Controller,Get,Post } from "@nestjs/common";
import { HrService } from "./hr.service";

@Controller("hr")
export class HrController{
 constructor(private service:HrService){}
 @Get() findAll(){ return this.service.findAll(); }
 @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
