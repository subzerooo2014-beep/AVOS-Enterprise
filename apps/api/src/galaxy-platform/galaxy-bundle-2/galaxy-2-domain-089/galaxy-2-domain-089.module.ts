import { Module } from "@nestjs/common";
import { Galaxy2Domain089Controller } from "./galaxy-2-domain-089.controller";
import { Galaxy2Domain089Service } from "./galaxy-2-domain-089.service";

@Module({
  controllers: [Galaxy2Domain089Controller],
  providers: [Galaxy2Domain089Service],
  exports: [Galaxy2Domain089Service],
})
export class Galaxy2Domain089Module {}