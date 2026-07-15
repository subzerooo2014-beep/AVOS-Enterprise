import { Module } from "@nestjs/common";
import { Galaxy2Domain080Controller } from "./galaxy-2-domain-080.controller";
import { Galaxy2Domain080Service } from "./galaxy-2-domain-080.service";

@Module({
  controllers: [Galaxy2Domain080Controller],
  providers: [Galaxy2Domain080Service],
  exports: [Galaxy2Domain080Service],
})
export class Galaxy2Domain080Module {}