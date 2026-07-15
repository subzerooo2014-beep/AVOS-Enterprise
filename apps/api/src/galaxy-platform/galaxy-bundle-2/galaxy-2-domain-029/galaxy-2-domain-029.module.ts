import { Module } from "@nestjs/common";
import { Galaxy2Domain029Controller } from "./galaxy-2-domain-029.controller";
import { Galaxy2Domain029Service } from "./galaxy-2-domain-029.service";

@Module({
  controllers: [Galaxy2Domain029Controller],
  providers: [Galaxy2Domain029Service],
  exports: [Galaxy2Domain029Service],
})
export class Galaxy2Domain029Module {}