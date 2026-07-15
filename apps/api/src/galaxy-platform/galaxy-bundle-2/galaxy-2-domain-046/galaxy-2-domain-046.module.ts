import { Module } from "@nestjs/common";
import { Galaxy2Domain046Controller } from "./galaxy-2-domain-046.controller";
import { Galaxy2Domain046Service } from "./galaxy-2-domain-046.service";

@Module({
  controllers: [Galaxy2Domain046Controller],
  providers: [Galaxy2Domain046Service],
  exports: [Galaxy2Domain046Service],
})
export class Galaxy2Domain046Module {}