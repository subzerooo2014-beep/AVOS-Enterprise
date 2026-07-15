import { Module } from "@nestjs/common";
import { Galaxy2Domain050Controller } from "./galaxy-2-domain-050.controller";
import { Galaxy2Domain050Service } from "./galaxy-2-domain-050.service";

@Module({
  controllers: [Galaxy2Domain050Controller],
  providers: [Galaxy2Domain050Service],
  exports: [Galaxy2Domain050Service],
})
export class Galaxy2Domain050Module {}