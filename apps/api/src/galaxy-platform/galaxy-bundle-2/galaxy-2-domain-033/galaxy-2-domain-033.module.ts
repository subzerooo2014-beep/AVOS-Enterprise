import { Module } from "@nestjs/common";
import { Galaxy2Domain033Controller } from "./galaxy-2-domain-033.controller";
import { Galaxy2Domain033Service } from "./galaxy-2-domain-033.service";

@Module({
  controllers: [Galaxy2Domain033Controller],
  providers: [Galaxy2Domain033Service],
  exports: [Galaxy2Domain033Service],
})
export class Galaxy2Domain033Module {}