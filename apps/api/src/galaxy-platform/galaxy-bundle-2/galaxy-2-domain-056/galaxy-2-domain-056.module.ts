import { Module } from "@nestjs/common";
import { Galaxy2Domain056Controller } from "./galaxy-2-domain-056.controller";
import { Galaxy2Domain056Service } from "./galaxy-2-domain-056.service";

@Module({
  controllers: [Galaxy2Domain056Controller],
  providers: [Galaxy2Domain056Service],
  exports: [Galaxy2Domain056Service],
})
export class Galaxy2Domain056Module {}