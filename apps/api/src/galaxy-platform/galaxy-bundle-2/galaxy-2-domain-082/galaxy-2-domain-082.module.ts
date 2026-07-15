import { Module } from "@nestjs/common";
import { Galaxy2Domain082Controller } from "./galaxy-2-domain-082.controller";
import { Galaxy2Domain082Service } from "./galaxy-2-domain-082.service";

@Module({
  controllers: [Galaxy2Domain082Controller],
  providers: [Galaxy2Domain082Service],
  exports: [Galaxy2Domain082Service],
})
export class Galaxy2Domain082Module {}