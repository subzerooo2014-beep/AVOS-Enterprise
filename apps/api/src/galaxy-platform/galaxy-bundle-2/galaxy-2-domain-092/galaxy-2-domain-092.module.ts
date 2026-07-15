import { Module } from "@nestjs/common";
import { Galaxy2Domain092Controller } from "./galaxy-2-domain-092.controller";
import { Galaxy2Domain092Service } from "./galaxy-2-domain-092.service";

@Module({
  controllers: [Galaxy2Domain092Controller],
  providers: [Galaxy2Domain092Service],
  exports: [Galaxy2Domain092Service],
})
export class Galaxy2Domain092Module {}