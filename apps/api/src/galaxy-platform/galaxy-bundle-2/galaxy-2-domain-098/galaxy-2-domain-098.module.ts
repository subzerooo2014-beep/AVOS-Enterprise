import { Module } from "@nestjs/common";
import { Galaxy2Domain098Controller } from "./galaxy-2-domain-098.controller";
import { Galaxy2Domain098Service } from "./galaxy-2-domain-098.service";

@Module({
  controllers: [Galaxy2Domain098Controller],
  providers: [Galaxy2Domain098Service],
  exports: [Galaxy2Domain098Service],
})
export class Galaxy2Domain098Module {}