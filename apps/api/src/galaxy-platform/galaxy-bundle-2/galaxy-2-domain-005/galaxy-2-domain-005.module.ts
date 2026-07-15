import { Module } from "@nestjs/common";
import { Galaxy2Domain005Controller } from "./galaxy-2-domain-005.controller";
import { Galaxy2Domain005Service } from "./galaxy-2-domain-005.service";

@Module({
  controllers: [Galaxy2Domain005Controller],
  providers: [Galaxy2Domain005Service],
  exports: [Galaxy2Domain005Service],
})
export class Galaxy2Domain005Module {}