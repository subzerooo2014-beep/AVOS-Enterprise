import { Body, Controller, Get, Post } from "@nestjs/common";
import { TrustService } from "./trust.service";

@Controller("trust")
export class TrustController {
  constructor(private service: TrustService) {}

  @Post("calculate")
  calculate(@Body() body: any) {
    return this.service.calculate(body.entityType, body.entityId, body.factors || {});
  }

  @Get()
  list() {
    return this.service.list();
  }
}
