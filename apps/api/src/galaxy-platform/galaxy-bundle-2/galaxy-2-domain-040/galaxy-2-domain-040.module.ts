import { Module } from "@nestjs/common";
import { Galaxy2Domain040Controller } from "./galaxy-2-domain-040.controller";
import { Galaxy2Domain040Service } from "./galaxy-2-domain-040.service";

@Module({
  controllers: [Galaxy2Domain040Controller],
  providers: [Galaxy2Domain040Service],
  exports: [Galaxy2Domain040Service],
})
export class Galaxy2Domain040Module {}