import { Body, Controller, Get, Post } from "@nestjs/common";
import { MaintenanceService } from "./maintenance.service";

@Controller("maintenance")
export class MaintenanceController {
  constructor(private service:MaintenanceService){}
  @Get() findAll(){ return this.service.findAll(); }
  @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
