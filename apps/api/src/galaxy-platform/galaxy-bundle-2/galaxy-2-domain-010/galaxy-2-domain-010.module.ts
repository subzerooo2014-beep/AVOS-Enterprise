import { Module } from "@nestjs/common";
import { Galaxy2Domain010Controller } from "./galaxy-2-domain-010.controller";
import { Galaxy2Domain010Service } from "./galaxy-2-domain-010.service";

@Module({
  controllers: [Galaxy2Domain010Controller],
  providers: [Galaxy2Domain010Service],
  exports: [Galaxy2Domain010Service],
})
export class Galaxy2Domain010Module {}