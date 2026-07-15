import { Module } from "@nestjs/common";
import { Galaxy2Domain003Controller } from "./galaxy-2-domain-003.controller";
import { Galaxy2Domain003Service } from "./galaxy-2-domain-003.service";

@Module({
  controllers: [Galaxy2Domain003Controller],
  providers: [Galaxy2Domain003Service],
  exports: [Galaxy2Domain003Service],
})
export class Galaxy2Domain003Module {}