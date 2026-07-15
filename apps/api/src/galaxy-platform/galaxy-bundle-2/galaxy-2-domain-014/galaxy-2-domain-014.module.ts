import { Module } from "@nestjs/common";
import { Galaxy2Domain014Controller } from "./galaxy-2-domain-014.controller";
import { Galaxy2Domain014Service } from "./galaxy-2-domain-014.service";

@Module({
  controllers: [Galaxy2Domain014Controller],
  providers: [Galaxy2Domain014Service],
  exports: [Galaxy2Domain014Service],
})
export class Galaxy2Domain014Module {}