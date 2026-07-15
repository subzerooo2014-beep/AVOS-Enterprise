import { Module } from "@nestjs/common";
import { Galaxy2Domain007Controller } from "./galaxy-2-domain-007.controller";
import { Galaxy2Domain007Service } from "./galaxy-2-domain-007.service";

@Module({
  controllers: [Galaxy2Domain007Controller],
  providers: [Galaxy2Domain007Service],
  exports: [Galaxy2Domain007Service],
})
export class Galaxy2Domain007Module {}