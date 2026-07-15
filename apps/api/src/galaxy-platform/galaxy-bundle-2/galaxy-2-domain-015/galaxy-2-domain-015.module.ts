import { Module } from "@nestjs/common";
import { Galaxy2Domain015Controller } from "./galaxy-2-domain-015.controller";
import { Galaxy2Domain015Service } from "./galaxy-2-domain-015.service";

@Module({
  controllers: [Galaxy2Domain015Controller],
  providers: [Galaxy2Domain015Service],
  exports: [Galaxy2Domain015Service],
})
export class Galaxy2Domain015Module {}