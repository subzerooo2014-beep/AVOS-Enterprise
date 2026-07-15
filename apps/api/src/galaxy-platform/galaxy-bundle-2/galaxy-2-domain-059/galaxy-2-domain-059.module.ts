import { Module } from "@nestjs/common";
import { Galaxy2Domain059Controller } from "./galaxy-2-domain-059.controller";
import { Galaxy2Domain059Service } from "./galaxy-2-domain-059.service";

@Module({
  controllers: [Galaxy2Domain059Controller],
  providers: [Galaxy2Domain059Service],
  exports: [Galaxy2Domain059Service],
})
export class Galaxy2Domain059Module {}