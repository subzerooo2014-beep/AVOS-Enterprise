import { Module } from "@nestjs/common";
import { Galaxy2Domain048Controller } from "./galaxy-2-domain-048.controller";
import { Galaxy2Domain048Service } from "./galaxy-2-domain-048.service";

@Module({
  controllers: [Galaxy2Domain048Controller],
  providers: [Galaxy2Domain048Service],
  exports: [Galaxy2Domain048Service],
})
export class Galaxy2Domain048Module {}