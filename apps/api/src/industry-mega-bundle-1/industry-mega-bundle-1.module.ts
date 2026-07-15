import { Module } from "@nestjs/common";
import { IndustryMegaBundle1Controller } from "./industry-mega-bundle-1.controller";
import { IndustryMegaBundle1Service } from "./industry-mega-bundle-1.service";

@Module({
  controllers: [IndustryMegaBundle1Controller],
  providers: [IndustryMegaBundle1Service],
  exports: [IndustryMegaBundle1Service],
})
export class IndustryMegaBundle1Module {}