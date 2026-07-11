import { Body, Controller, Get, Post } from "@nestjs/common";
import { ExportAdvisorService } from "./export-advisor.service";

@Controller("export-advisor")
export class ExportAdvisorController {
  constructor(private service: ExportAdvisorService) {}

  @Post("advise")
  advise(@Body() body: any) {
    return this.service.advise(body);
  }

  @Get()
  list() {
    return this.service.list();
  }
}
