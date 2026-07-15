import { Module } from "@nestjs/common";
import { Galaxy2Domain064Controller } from "./galaxy-2-domain-064.controller";
import { Galaxy2Domain064Service } from "./galaxy-2-domain-064.service";

@Module({
  controllers: [Galaxy2Domain064Controller],
  providers: [Galaxy2Domain064Service],
  exports: [Galaxy2Domain064Service],
})
export class Galaxy2Domain064Module {}