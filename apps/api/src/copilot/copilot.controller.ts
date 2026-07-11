import { Body, Controller, Get, Post } from "@nestjs/common";
import { CopilotService } from "./copilot.service";

@Controller("copilot")
export class CopilotController {
  constructor(private service:CopilotService){}
  @Get() findAll(){ return this.service.findAll(); }
  @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
