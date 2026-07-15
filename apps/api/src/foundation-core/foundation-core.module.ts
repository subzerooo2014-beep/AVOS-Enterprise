import { Module } from "@nestjs/common";
import { FoundationCoreController } from "./foundation-core.controller";
import { FoundationCoreService } from "./foundation-core.service";

@Module({
  controllers: [FoundationCoreController],
  providers: [FoundationCoreService],
  exports: [FoundationCoreService],
})
export class FoundationCoreModule {}