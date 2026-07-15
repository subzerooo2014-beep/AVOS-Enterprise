import { Module } from "@nestjs/common";
import { Galaxy2Domain009Controller } from "./galaxy-2-domain-009.controller";
import { Galaxy2Domain009Service } from "./galaxy-2-domain-009.service";

@Module({
  controllers: [Galaxy2Domain009Controller],
  providers: [Galaxy2Domain009Service],
  exports: [Galaxy2Domain009Service],
})
export class Galaxy2Domain009Module {}