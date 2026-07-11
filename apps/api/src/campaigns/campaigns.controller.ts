import { Body, Controller, Get, Post } from "@nestjs/common";
import { CampaignsService } from "./campaigns.service";

@Controller("campaigns")
export class CampaignsController {
  constructor(private service:CampaignsService){}
  @Get() findAll(){ return this.service.findAll(); }
  @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
