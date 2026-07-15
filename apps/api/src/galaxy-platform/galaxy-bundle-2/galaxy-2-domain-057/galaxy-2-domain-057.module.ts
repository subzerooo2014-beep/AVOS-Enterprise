import { Module } from "@nestjs/common";
import { Galaxy2Domain057Controller } from "./galaxy-2-domain-057.controller";
import { Galaxy2Domain057Service } from "./galaxy-2-domain-057.service";

@Module({
  controllers: [Galaxy2Domain057Controller],
  providers: [Galaxy2Domain057Service],
  exports: [Galaxy2Domain057Service],
})
export class Galaxy2Domain057Module {}