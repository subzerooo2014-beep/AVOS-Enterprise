import { Module } from "@nestjs/common";
import { Galaxy2Domain041Controller } from "./galaxy-2-domain-041.controller";
import { Galaxy2Domain041Service } from "./galaxy-2-domain-041.service";

@Module({
  controllers: [Galaxy2Domain041Controller],
  providers: [Galaxy2Domain041Service],
  exports: [Galaxy2Domain041Service],
})
export class Galaxy2Domain041Module {}