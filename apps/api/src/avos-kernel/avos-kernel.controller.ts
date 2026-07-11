import { Body, Controller, Get, Post } from "@nestjs/common";
import { AvosKernelService } from "./avos-kernel.service";

@Controller("avos-kernel")
export class AvosKernelController {
  constructor(private service: AvosKernelService) {}

  @Post("decide")
  decide(@Body() body: any) {
    return this.service.decide(body);
  }

  @Get("decisions")
  list() {
    return this.service.list();
  }
}
