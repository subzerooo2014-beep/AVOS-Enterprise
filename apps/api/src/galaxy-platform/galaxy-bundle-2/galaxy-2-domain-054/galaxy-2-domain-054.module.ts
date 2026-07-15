import { Module } from "@nestjs/common";
import { Galaxy2Domain054Controller } from "./galaxy-2-domain-054.controller";
import { Galaxy2Domain054Service } from "./galaxy-2-domain-054.service";

@Module({
  controllers: [Galaxy2Domain054Controller],
  providers: [Galaxy2Domain054Service],
  exports: [Galaxy2Domain054Service],
})
export class Galaxy2Domain054Module {}