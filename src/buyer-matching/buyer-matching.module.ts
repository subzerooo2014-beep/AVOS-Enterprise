import { Module } from "@nestjs/common";
import { BuyerMatchingController } from "./buyer-matching.controller";
import { BuyerMatchingService } from "./buyer-matching.service";

@Module({
  controllers: [BuyerMatchingController],
  providers: [BuyerMatchingService],
  exports: [BuyerMatchingService],
})
export class BuyerMatchingModule {}
