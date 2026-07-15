import { Module } from "@nestjs/common";
import { Galaxy2Domain095Controller } from "./galaxy-2-domain-095.controller";
import { Galaxy2Domain095Service } from "./galaxy-2-domain-095.service";

@Module({
  controllers: [Galaxy2Domain095Controller],
  providers: [Galaxy2Domain095Service],
  exports: [Galaxy2Domain095Service],
})
export class Galaxy2Domain095Module {}