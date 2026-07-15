import { Module } from "@nestjs/common";
import { TitanBundle2Controller } from "./titan-bundle-2.controller";
import { TitanBundle2Service } from "./titan-bundle-2.service";

@Module({
  controllers: [TitanBundle2Controller],
  providers: [TitanBundle2Service],
  exports: [TitanBundle2Service],
})
export class TitanBundle2Module {}