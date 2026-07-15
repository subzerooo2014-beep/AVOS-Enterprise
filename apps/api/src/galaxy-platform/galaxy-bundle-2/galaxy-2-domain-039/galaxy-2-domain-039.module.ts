import { Module } from "@nestjs/common";
import { Galaxy2Domain039Controller } from "./galaxy-2-domain-039.controller";
import { Galaxy2Domain039Service } from "./galaxy-2-domain-039.service";

@Module({
  controllers: [Galaxy2Domain039Controller],
  providers: [Galaxy2Domain039Service],
  exports: [Galaxy2Domain039Service],
})
export class Galaxy2Domain039Module {}