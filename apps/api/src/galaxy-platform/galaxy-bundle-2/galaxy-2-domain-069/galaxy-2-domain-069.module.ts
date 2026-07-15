import { Module } from "@nestjs/common";
import { Galaxy2Domain069Controller } from "./galaxy-2-domain-069.controller";
import { Galaxy2Domain069Service } from "./galaxy-2-domain-069.service";

@Module({
  controllers: [Galaxy2Domain069Controller],
  providers: [Galaxy2Domain069Service],
  exports: [Galaxy2Domain069Service],
})
export class Galaxy2Domain069Module {}