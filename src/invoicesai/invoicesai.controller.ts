import { Body, Controller, Get, Post } from "@nestjs/common";
import { InvoicesaiService } from "./invoicesai.service";

@Controller("invoicesai")
export class InvoicesaiController{
 constructor(private service:InvoicesaiService){}
 @Get() findAll(){ return this.service.findAll(); }
 @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
