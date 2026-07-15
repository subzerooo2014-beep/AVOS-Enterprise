import { Module } from "@nestjs/common";
import { Galaxy2Domain075Controller } from "./galaxy-2-domain-075.controller";
import { Galaxy2Domain075Service } from "./galaxy-2-domain-075.service";

@Module({
  controllers: [Galaxy2Domain075Controller],
  providers: [Galaxy2Domain075Service],
  exports: [Galaxy2Domain075Service],
})
export class Galaxy2Domain075Module {}