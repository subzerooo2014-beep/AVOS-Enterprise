import { Module } from "@nestjs/common";
import { Galaxy2Domain030Controller } from "./galaxy-2-domain-030.controller";
import { Galaxy2Domain030Service } from "./galaxy-2-domain-030.service";

@Module({
  controllers: [Galaxy2Domain030Controller],
  providers: [Galaxy2Domain030Service],
  exports: [Galaxy2Domain030Service],
})
export class Galaxy2Domain030Module {}