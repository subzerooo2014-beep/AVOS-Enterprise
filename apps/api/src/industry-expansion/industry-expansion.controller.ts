import { Body, Controller, Get, Param, Patch, Post } from "@nestjs/common";
import { IndustryExpansionService } from "./industry-expansion.service";
import { IndustryListingRequest } from "./industry-expansion.types";

@Controller("industry-expansion")
export class IndustryExpansionController {
  constructor(private readonly industry: IndustryExpansionService) {}

  @Get("verticals")
  verticals() {
    return this.industry.verticals();
  }

  @Get("verticals/:key")
  vertical(@Param("key") key: string) {
    return this.industry.vertical(key);
  }

  @Post("listings")
  createListing(@Body() input: IndustryListingRequest) {
    return this.industry.createListing(input);
  }

  @Patch("listings/:id/publish")
  publishListing(@Param("id") id: string) {
    return this.industry.publishListing(id);
  }

  @Get("verticals/:key/listings")
  listingsForVertical(@Param("key") key: string) {
    return this.industry.listingsForVertical(key);
  }

  @Get("dashboard")
  dashboard() {
    return this.industry.dashboard();
  }
}