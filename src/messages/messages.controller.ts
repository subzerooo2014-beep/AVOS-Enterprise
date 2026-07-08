import { Body,Controller,Get,Post } from "@nestjs/common";
import { MessagesService } from "./messages.service";

@Controller("messages")
export class MessagesController{
 constructor(private service:MessagesService){}
 @Get() findAll(){ return this.service.findAll(); }
 @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
