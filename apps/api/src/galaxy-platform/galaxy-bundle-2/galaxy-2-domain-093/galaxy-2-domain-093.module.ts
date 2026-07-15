import { Module } from "@nestjs/common";
import { Galaxy2Domain093Controller } from "./galaxy-2-domain-093.controller";
import { Galaxy2Domain093Service } from "./galaxy-2-domain-093.service";

@Module({
  controllers: [Galaxy2Domain093Controller],
  providers: [Galaxy2Domain093Service],
  exports: [Galaxy2Domain093Service],
})
export class Galaxy2Domain093Module {}