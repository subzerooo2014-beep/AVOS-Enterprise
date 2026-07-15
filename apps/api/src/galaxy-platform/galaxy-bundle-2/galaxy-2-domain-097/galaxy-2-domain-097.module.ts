import { Module } from "@nestjs/common";
import { Galaxy2Domain097Controller } from "./galaxy-2-domain-097.controller";
import { Galaxy2Domain097Service } from "./galaxy-2-domain-097.service";

@Module({
  controllers: [Galaxy2Domain097Controller],
  providers: [Galaxy2Domain097Service],
  exports: [Galaxy2Domain097Service],
})
export class Galaxy2Domain097Module {}