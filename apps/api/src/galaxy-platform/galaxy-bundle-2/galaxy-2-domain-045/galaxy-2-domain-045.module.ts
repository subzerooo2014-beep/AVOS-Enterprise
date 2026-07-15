import { Module } from "@nestjs/common";
import { Galaxy2Domain045Controller } from "./galaxy-2-domain-045.controller";
import { Galaxy2Domain045Service } from "./galaxy-2-domain-045.service";

@Module({
  controllers: [Galaxy2Domain045Controller],
  providers: [Galaxy2Domain045Service],
  exports: [Galaxy2Domain045Service],
})
export class Galaxy2Domain045Module {}