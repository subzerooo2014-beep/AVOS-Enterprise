import { Module } from "@nestjs/common";
import { Galaxy2Domain060Controller } from "./galaxy-2-domain-060.controller";
import { Galaxy2Domain060Service } from "./galaxy-2-domain-060.service";

@Module({
  controllers: [Galaxy2Domain060Controller],
  providers: [Galaxy2Domain060Service],
  exports: [Galaxy2Domain060Service],
})
export class Galaxy2Domain060Module {}