import { Module } from "@nestjs/common";
import { Galaxy2Domain032Controller } from "./galaxy-2-domain-032.controller";
import { Galaxy2Domain032Service } from "./galaxy-2-domain-032.service";

@Module({
  controllers: [Galaxy2Domain032Controller],
  providers: [Galaxy2Domain032Service],
  exports: [Galaxy2Domain032Service],
})
export class Galaxy2Domain032Module {}