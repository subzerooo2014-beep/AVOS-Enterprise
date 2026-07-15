import { Module } from "@nestjs/common";
import { Galaxy2Domain063Controller } from "./galaxy-2-domain-063.controller";
import { Galaxy2Domain063Service } from "./galaxy-2-domain-063.service";

@Module({
  controllers: [Galaxy2Domain063Controller],
  providers: [Galaxy2Domain063Service],
  exports: [Galaxy2Domain063Service],
})
export class Galaxy2Domain063Module {}