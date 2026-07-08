import { Body, Controller, Get, Post } from "@nestjs/common";
import { LicensingService } from "./licensing.service";

@Controller("licensing")
export class LicensingController{
 constructor(private service:LicensingService){}
 @Get() findAll(){ return this.service.findAll(); }
 @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
