import { Module } from "@nestjs/common";
import { BankingPlatformController } from "./banking-platform.controller";
import { BankingPlatformService } from "./banking-platform.service";

@Module({
  controllers: [BankingPlatformController],
  providers: [BankingPlatformService],
  exports: [BankingPlatformService],
})
export class BankingPlatformModule {}