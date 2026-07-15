import { Module } from "@nestjs/common";
import { Galaxy2Domain074Controller } from "./galaxy-2-domain-074.controller";
import { Galaxy2Domain074Service } from "./galaxy-2-domain-074.service";

@Module({
  controllers: [Galaxy2Domain074Controller],
  providers: [Galaxy2Domain074Service],
  exports: [Galaxy2Domain074Service],
})
export class Galaxy2Domain074Module {}