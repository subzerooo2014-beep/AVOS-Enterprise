import { Module } from "@nestjs/common";
import { Galaxy2Domain094Controller } from "./galaxy-2-domain-094.controller";
import { Galaxy2Domain094Service } from "./galaxy-2-domain-094.service";

@Module({
  controllers: [Galaxy2Domain094Controller],
  providers: [Galaxy2Domain094Service],
  exports: [Galaxy2Domain094Service],
})
export class Galaxy2Domain094Module {}