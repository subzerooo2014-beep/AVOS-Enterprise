import { Module } from "@nestjs/common";
import { IndustryMegaBundle3Controller } from "./industry-mega-bundle-3.controller";
import { IndustryMegaBundle3Service } from "./industry-mega-bundle-3.service";

@Module({
  controllers: [IndustryMegaBundle3Controller],
  providers: [IndustryMegaBundle3Service],
  exports: [IndustryMegaBundle3Service],
})
export class IndustryMegaBundle3Module {}