import { Module } from "@nestjs/common";
import { Galaxy2Domain088Controller } from "./galaxy-2-domain-088.controller";
import { Galaxy2Domain088Service } from "./galaxy-2-domain-088.service";

@Module({
  controllers: [Galaxy2Domain088Controller],
  providers: [Galaxy2Domain088Service],
  exports: [Galaxy2Domain088Service],
})
export class Galaxy2Domain088Module {}