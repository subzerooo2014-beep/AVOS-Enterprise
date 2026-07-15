import { Module } from "@nestjs/common";
import { Galaxy2Domain086Controller } from "./galaxy-2-domain-086.controller";
import { Galaxy2Domain086Service } from "./galaxy-2-domain-086.service";

@Module({
  controllers: [Galaxy2Domain086Controller],
  providers: [Galaxy2Domain086Service],
  exports: [Galaxy2Domain086Service],
})
export class Galaxy2Domain086Module {}