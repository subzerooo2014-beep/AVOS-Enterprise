import { Module } from "@nestjs/common";
import { Galaxy2Domain044Controller } from "./galaxy-2-domain-044.controller";
import { Galaxy2Domain044Service } from "./galaxy-2-domain-044.service";

@Module({
  controllers: [Galaxy2Domain044Controller],
  providers: [Galaxy2Domain044Service],
  exports: [Galaxy2Domain044Service],
})
export class Galaxy2Domain044Module {}