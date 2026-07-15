import { Module } from "@nestjs/common";
import { Galaxy2Domain067Controller } from "./galaxy-2-domain-067.controller";
import { Galaxy2Domain067Service } from "./galaxy-2-domain-067.service";

@Module({
  controllers: [Galaxy2Domain067Controller],
  providers: [Galaxy2Domain067Service],
  exports: [Galaxy2Domain067Service],
})
export class Galaxy2Domain067Module {}