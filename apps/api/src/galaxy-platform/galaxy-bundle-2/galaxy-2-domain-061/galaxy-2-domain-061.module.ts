import { Module } from "@nestjs/common";
import { Galaxy2Domain061Controller } from "./galaxy-2-domain-061.controller";
import { Galaxy2Domain061Service } from "./galaxy-2-domain-061.service";

@Module({
  controllers: [Galaxy2Domain061Controller],
  providers: [Galaxy2Domain061Service],
  exports: [Galaxy2Domain061Service],
})
export class Galaxy2Domain061Module {}