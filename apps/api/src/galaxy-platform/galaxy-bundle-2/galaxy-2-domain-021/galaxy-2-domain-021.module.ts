import { Module } from "@nestjs/common";
import { Galaxy2Domain021Controller } from "./galaxy-2-domain-021.controller";
import { Galaxy2Domain021Service } from "./galaxy-2-domain-021.service";

@Module({
  controllers: [Galaxy2Domain021Controller],
  providers: [Galaxy2Domain021Service],
  exports: [Galaxy2Domain021Service],
})
export class Galaxy2Domain021Module {}