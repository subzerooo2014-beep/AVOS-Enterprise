import { Module } from "@nestjs/common";
import { Galaxy2Domain076Controller } from "./galaxy-2-domain-076.controller";
import { Galaxy2Domain076Service } from "./galaxy-2-domain-076.service";

@Module({
  controllers: [Galaxy2Domain076Controller],
  providers: [Galaxy2Domain076Service],
  exports: [Galaxy2Domain076Service],
})
export class Galaxy2Domain076Module {}