import { Module } from "@nestjs/common";
import { Galaxy2Domain012Controller } from "./galaxy-2-domain-012.controller";
import { Galaxy2Domain012Service } from "./galaxy-2-domain-012.service";

@Module({
  controllers: [Galaxy2Domain012Controller],
  providers: [Galaxy2Domain012Service],
  exports: [Galaxy2Domain012Service],
})
export class Galaxy2Domain012Module {}