import { Module } from "@nestjs/common";
import { Galaxy2Domain084Controller } from "./galaxy-2-domain-084.controller";
import { Galaxy2Domain084Service } from "./galaxy-2-domain-084.service";

@Module({
  controllers: [Galaxy2Domain084Controller],
  providers: [Galaxy2Domain084Service],
  exports: [Galaxy2Domain084Service],
})
export class Galaxy2Domain084Module {}