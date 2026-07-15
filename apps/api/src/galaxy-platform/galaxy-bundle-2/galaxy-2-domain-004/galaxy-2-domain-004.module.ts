import { Module } from "@nestjs/common";
import { Galaxy2Domain004Controller } from "./galaxy-2-domain-004.controller";
import { Galaxy2Domain004Service } from "./galaxy-2-domain-004.service";

@Module({
  controllers: [Galaxy2Domain004Controller],
  providers: [Galaxy2Domain004Service],
  exports: [Galaxy2Domain004Service],
})
export class Galaxy2Domain004Module {}