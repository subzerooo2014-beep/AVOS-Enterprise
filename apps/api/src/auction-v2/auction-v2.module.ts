import { Module } from "@nestjs/common";
import { AuctionV2Controller } from "./auction-v2.controller";
import { AuctionV2Service } from "./auction-v2.service";

@Module({
  controllers: [AuctionV2Controller],
  providers: [AuctionV2Service],
  exports: [AuctionV2Service],
})
export class AuctionV2Module {}