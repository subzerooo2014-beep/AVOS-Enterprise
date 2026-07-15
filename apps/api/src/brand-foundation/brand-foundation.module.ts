import { Module } from "@nestjs/common";
import { BrandFoundationController } from "./brand-foundation.controller";
import { BrandFoundationService } from "./brand-foundation.service";

@Module({
  controllers: [BrandFoundationController],
  providers: [BrandFoundationService],
  exports: [BrandFoundationService],
})
export class BrandFoundationModule {}