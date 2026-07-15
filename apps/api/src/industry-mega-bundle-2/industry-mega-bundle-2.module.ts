import { Module } from "@nestjs/common";
import { IndustryMegaBundle2Controller } from "./industry-mega-bundle-2.controller";
import { IndustryMegaBundle2Service } from "./industry-mega-bundle-2.service";

@Module({
  controllers: [IndustryMegaBundle2Controller],
  providers: [IndustryMegaBundle2Service],
  exports: [IndustryMegaBundle2Service],
})
export class IndustryMegaBundle2Module {}