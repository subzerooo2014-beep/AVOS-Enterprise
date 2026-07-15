import { Module } from "@nestjs/common";
import { Galaxy2Domain051Controller } from "./galaxy-2-domain-051.controller";
import { Galaxy2Domain051Service } from "./galaxy-2-domain-051.service";

@Module({
  controllers: [Galaxy2Domain051Controller],
  providers: [Galaxy2Domain051Service],
  exports: [Galaxy2Domain051Service],
})
export class Galaxy2Domain051Module {}