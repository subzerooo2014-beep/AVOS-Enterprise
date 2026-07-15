import { Module } from "@nestjs/common";
import { Galaxy2Domain019Controller } from "./galaxy-2-domain-019.controller";
import { Galaxy2Domain019Service } from "./galaxy-2-domain-019.service";

@Module({
  controllers: [Galaxy2Domain019Controller],
  providers: [Galaxy2Domain019Service],
  exports: [Galaxy2Domain019Service],
})
export class Galaxy2Domain019Module {}