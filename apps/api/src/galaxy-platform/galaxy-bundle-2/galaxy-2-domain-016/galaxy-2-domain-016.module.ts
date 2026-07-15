import { Module } from "@nestjs/common";
import { Galaxy2Domain016Controller } from "./galaxy-2-domain-016.controller";
import { Galaxy2Domain016Service } from "./galaxy-2-domain-016.service";

@Module({
  controllers: [Galaxy2Domain016Controller],
  providers: [Galaxy2Domain016Service],
  exports: [Galaxy2Domain016Service],
})
export class Galaxy2Domain016Module {}