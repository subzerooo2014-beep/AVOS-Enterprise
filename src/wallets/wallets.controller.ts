import { Body, Controller, Get, Post } from "@nestjs/common";
import { WalletsService } from "./wallets.service";

@Controller("wallets")
export class WalletsController {
  constructor(private service: WalletsService) {}
  @Get() findAll() { return this.service.findAll(); }
  @Post() create(@Body() dto: any) { return this.service.create(dto); }
}
