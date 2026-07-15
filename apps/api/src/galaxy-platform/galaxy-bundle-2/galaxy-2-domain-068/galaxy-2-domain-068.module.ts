import { Module } from "@nestjs/common";
import { Galaxy2Domain068Controller } from "./galaxy-2-domain-068.controller";
import { Galaxy2Domain068Service } from "./galaxy-2-domain-068.service";

@Module({
  controllers: [Galaxy2Domain068Controller],
  providers: [Galaxy2Domain068Service],
  exports: [Galaxy2Domain068Service],
})
export class Galaxy2Domain068Module {}