import { Module } from "@nestjs/common";
import { Galaxy2Domain001Controller } from "./galaxy-2-domain-001.controller";
import { Galaxy2Domain001Service } from "./galaxy-2-domain-001.service";

@Module({
  controllers: [Galaxy2Domain001Controller],
  providers: [Galaxy2Domain001Service],
  exports: [Galaxy2Domain001Service],
})
export class Galaxy2Domain001Module {}