import { Module } from "@nestjs/common";
import { Galaxy2Domain027Controller } from "./galaxy-2-domain-027.controller";
import { Galaxy2Domain027Service } from "./galaxy-2-domain-027.service";

@Module({
  controllers: [Galaxy2Domain027Controller],
  providers: [Galaxy2Domain027Service],
  exports: [Galaxy2Domain027Service],
})
export class Galaxy2Domain027Module {}