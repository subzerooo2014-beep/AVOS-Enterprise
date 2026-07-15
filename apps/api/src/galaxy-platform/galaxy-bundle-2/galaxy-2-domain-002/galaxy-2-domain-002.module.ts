import { Module } from "@nestjs/common";
import { Galaxy2Domain002Controller } from "./galaxy-2-domain-002.controller";
import { Galaxy2Domain002Service } from "./galaxy-2-domain-002.service";

@Module({
  controllers: [Galaxy2Domain002Controller],
  providers: [Galaxy2Domain002Service],
  exports: [Galaxy2Domain002Service],
})
export class Galaxy2Domain002Module {}