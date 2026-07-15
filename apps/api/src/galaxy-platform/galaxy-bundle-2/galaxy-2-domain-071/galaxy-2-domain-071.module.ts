import { Module } from "@nestjs/common";
import { Galaxy2Domain071Controller } from "./galaxy-2-domain-071.controller";
import { Galaxy2Domain071Service } from "./galaxy-2-domain-071.service";

@Module({
  controllers: [Galaxy2Domain071Controller],
  providers: [Galaxy2Domain071Service],
  exports: [Galaxy2Domain071Service],
})
export class Galaxy2Domain071Module {}