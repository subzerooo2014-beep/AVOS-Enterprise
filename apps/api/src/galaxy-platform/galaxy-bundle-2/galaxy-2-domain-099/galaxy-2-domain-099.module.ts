import { Module } from "@nestjs/common";
import { Galaxy2Domain099Controller } from "./galaxy-2-domain-099.controller";
import { Galaxy2Domain099Service } from "./galaxy-2-domain-099.service";

@Module({
  controllers: [Galaxy2Domain099Controller],
  providers: [Galaxy2Domain099Service],
  exports: [Galaxy2Domain099Service],
})
export class Galaxy2Domain099Module {}