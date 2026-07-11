import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { BuyerMatchingService } from "./buyer-matching.service";

@Controller("buyer-matching")
export class BuyerMatchingController {
  constructor(private service: BuyerMatchingService) {}

  @Post("leads")
  createLead(@Body() body: any) {
    return this.service.createLead(body);
  }

  @Get("leads")
  listLeads() {
    return this.service.listLeads();
  }

  @Post("leads/:id/match")
  match(@Param("id") id: string, @Body() body: any) {
    return this.service.matchBuyer(id, body);
  }

  @Get("matches")
  listMatches() {
    return this.service.listMatches();
  }
}
