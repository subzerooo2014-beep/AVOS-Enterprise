import { Module } from "@nestjs/common";
import { LiveAuctionsController } from "./live-auctions.controller";
import { LiveAuctionsService } from "./live-auctions.service";

@Module({
  controllers: [LiveAuctionsController],
  providers: [LiveAuctionsService],
  exports: [LiveAuctionsService],
})
export class LiveAuctionsModule {}