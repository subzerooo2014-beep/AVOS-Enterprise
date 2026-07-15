import { Module } from "@nestjs/common";
import { Galaxy2Domain013Controller } from "./galaxy-2-domain-013.controller";
import { Galaxy2Domain013Service } from "./galaxy-2-domain-013.service";

@Module({
  controllers: [Galaxy2Domain013Controller],
  providers: [Galaxy2Domain013Service],
  exports: [Galaxy2Domain013Service],
})
export class Galaxy2Domain013Module {}