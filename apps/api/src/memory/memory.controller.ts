import { Body, Controller, Get, Post } from "@nestjs/common";
import { MemoryService } from "./memory.service";

@Controller("memory")
export class MemoryController {
  constructor(private service:MemoryService){}
  @Get() findAll(){ return this.service.findAll(); }
  @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
