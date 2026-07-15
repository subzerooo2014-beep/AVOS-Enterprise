import { Module } from "@nestjs/common";
import { FoundationMegaBundleController } from "./foundation-mega-bundle.controller";
import { FoundationMegaBundleService } from "./foundation-mega-bundle.service";

@Module({
  controllers: [FoundationMegaBundleController],
  providers: [FoundationMegaBundleService],
  exports: [FoundationMegaBundleService],
})
export class FoundationMegaBundleModule {}