import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { PartnersService } from "./partners.service";

@Controller("partners")
export class PartnersController {
  constructor(private service: PartnersService) {}

  @Post()
  create(@Body() body: any) {
    return this.service.create(body);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() body: any) {
    return this.service.update(id, body);
  }
}
