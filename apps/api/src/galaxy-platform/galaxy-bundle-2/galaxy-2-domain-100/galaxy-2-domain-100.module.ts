import { Module } from "@nestjs/common";
import { Galaxy2Domain100Controller } from "./galaxy-2-domain-100.controller";
import { Galaxy2Domain100Service } from "./galaxy-2-domain-100.service";

@Module({
  controllers: [Galaxy2Domain100Controller],
  providers: [Galaxy2Domain100Service],
  exports: [Galaxy2Domain100Service],
})
export class Galaxy2Domain100Module {}