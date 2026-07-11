import { Body, Controller, Get, Post } from "@nestjs/common";
import { BranchescrmService } from "./branchescrm.service";

@Controller("branchescrm")
export class BranchescrmController {
  constructor(private service:BranchescrmService){}
  @Get() findAll(){ return this.service.findAll(); }
  @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
