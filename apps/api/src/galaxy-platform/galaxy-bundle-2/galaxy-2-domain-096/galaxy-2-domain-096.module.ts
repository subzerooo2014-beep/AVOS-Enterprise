import { Module } from "@nestjs/common";
import { Galaxy2Domain096Controller } from "./galaxy-2-domain-096.controller";
import { Galaxy2Domain096Service } from "./galaxy-2-domain-096.service";

@Module({
  controllers: [Galaxy2Domain096Controller],
  providers: [Galaxy2Domain096Service],
  exports: [Galaxy2Domain096Service],
})
export class Galaxy2Domain096Module {}