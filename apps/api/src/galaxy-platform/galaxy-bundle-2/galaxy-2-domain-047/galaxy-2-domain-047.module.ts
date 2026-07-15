import { Module } from "@nestjs/common";
import { Galaxy2Domain047Controller } from "./galaxy-2-domain-047.controller";
import { Galaxy2Domain047Service } from "./galaxy-2-domain-047.service";

@Module({
  controllers: [Galaxy2Domain047Controller],
  providers: [Galaxy2Domain047Service],
  exports: [Galaxy2Domain047Service],
})
export class Galaxy2Domain047Module {}