import { Module } from "@nestjs/common";
import { Galaxy2Domain078Controller } from "./galaxy-2-domain-078.controller";
import { Galaxy2Domain078Service } from "./galaxy-2-domain-078.service";

@Module({
  controllers: [Galaxy2Domain078Controller],
  providers: [Galaxy2Domain078Service],
  exports: [Galaxy2Domain078Service],
})
export class Galaxy2Domain078Module {}