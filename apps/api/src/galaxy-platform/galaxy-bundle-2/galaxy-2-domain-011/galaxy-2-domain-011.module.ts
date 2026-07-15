import { Module } from "@nestjs/common";
import { Galaxy2Domain011Controller } from "./galaxy-2-domain-011.controller";
import { Galaxy2Domain011Service } from "./galaxy-2-domain-011.service";

@Module({
  controllers: [Galaxy2Domain011Controller],
  providers: [Galaxy2Domain011Service],
  exports: [Galaxy2Domain011Service],
})
export class Galaxy2Domain011Module {}