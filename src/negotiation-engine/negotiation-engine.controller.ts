import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { NegotiationEngineService } from "./negotiation-engine.service";

@Controller("negotiation-engine")
export class NegotiationEngineController {
  constructor(private service: NegotiationEngineService) {}

  @Post("sessions")
  create(@Body() body: any) {
    return this.service.createSession(body);
  }

  @Patch("sessions/:id/counter-offer")
  counter(@Param("id") id: string, @Body() body: any) {
    return this.service.counterOffer(id, body);
  }

  @Get("sessions")
  list() {
    return this.service.list();
  }
}
