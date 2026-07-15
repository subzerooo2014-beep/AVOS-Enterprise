import { Module } from "@nestjs/common";
import { Galaxy2Domain081Controller } from "./galaxy-2-domain-081.controller";
import { Galaxy2Domain081Service } from "./galaxy-2-domain-081.service";

@Module({
  controllers: [Galaxy2Domain081Controller],
  providers: [Galaxy2Domain081Service],
  exports: [Galaxy2Domain081Service],
})
export class Galaxy2Domain081Module {}