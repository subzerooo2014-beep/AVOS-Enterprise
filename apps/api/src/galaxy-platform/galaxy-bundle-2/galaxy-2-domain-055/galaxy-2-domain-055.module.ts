import { Module } from "@nestjs/common";
import { Galaxy2Domain055Controller } from "./galaxy-2-domain-055.controller";
import { Galaxy2Domain055Service } from "./galaxy-2-domain-055.service";

@Module({
  controllers: [Galaxy2Domain055Controller],
  providers: [Galaxy2Domain055Service],
  exports: [Galaxy2Domain055Service],
})
export class Galaxy2Domain055Module {}