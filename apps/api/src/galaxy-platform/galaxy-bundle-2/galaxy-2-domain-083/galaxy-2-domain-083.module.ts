import { Module } from "@nestjs/common";
import { Galaxy2Domain083Controller } from "./galaxy-2-domain-083.controller";
import { Galaxy2Domain083Service } from "./galaxy-2-domain-083.service";

@Module({
  controllers: [Galaxy2Domain083Controller],
  providers: [Galaxy2Domain083Service],
  exports: [Galaxy2Domain083Service],
})
export class Galaxy2Domain083Module {}