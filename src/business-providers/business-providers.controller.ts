import { Body, Controller, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { BusinessProvidersService } from "./business-providers.service";

@Controller("business-providers")
export class BusinessProvidersController {
  constructor(private service: BusinessProvidersService) {}

  @Post()
  createProvider(@Body() body: any) {
    return this.service.createProvider(body);
  }

  @Get()
  listProviders(@Query("type") type?: string) {
    return this.service.listProviders(type);
  }

  @Get(":id")
  findProvider(@Param("id") id: string) {
    return this.service.findProvider(id);
  }

  @Patch(":id/score")
  updateScore(@Param("id") id: string, @Body() body: any) {
    return this.service.updateProviderScore(id, body);
  }

  @Post("offers")
  createOffer(@Body() body: any) {
    return this.service.createOffer(body);
  }

  @Get("offers/list")
  listOffers(@Query("serviceType") serviceType?: string) {
    return this.service.listOffers(serviceType);
  }

  @Post("match")
  matchProvider(@Body() body: any) {
    return this.service.matchProvider(body);
  }

  @Get("matches/list")
  listMatches() {
    return this.service.listMatches();
  }
}
