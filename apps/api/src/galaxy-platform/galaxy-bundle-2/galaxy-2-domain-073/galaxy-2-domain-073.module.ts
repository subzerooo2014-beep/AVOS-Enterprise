import { Module } from "@nestjs/common";
import { Galaxy2Domain073Controller } from "./galaxy-2-domain-073.controller";
import { Galaxy2Domain073Service } from "./galaxy-2-domain-073.service";

@Module({
  controllers: [Galaxy2Domain073Controller],
  providers: [Galaxy2Domain073Service],
  exports: [Galaxy2Domain073Service],
})
export class Galaxy2Domain073Module {}