import { Module } from "@nestjs/common";
import { Galaxy2Domain053Controller } from "./galaxy-2-domain-053.controller";
import { Galaxy2Domain053Service } from "./galaxy-2-domain-053.service";

@Module({
  controllers: [Galaxy2Domain053Controller],
  providers: [Galaxy2Domain053Service],
  exports: [Galaxy2Domain053Service],
})
export class Galaxy2Domain053Module {}