import { Body, Controller, Get, Post } from "@nestjs/common";
import { MarketplacecoreService } from "./marketplacecore.service";

@Controller("marketplacecore")
export class MarketplacecoreController{
 constructor(private service:MarketplacecoreService){}
 @Get() findAll(){ return this.service.findAll(); }
 @Post() create(@Body() dto:any){ return this.service.create(dto); }
}
