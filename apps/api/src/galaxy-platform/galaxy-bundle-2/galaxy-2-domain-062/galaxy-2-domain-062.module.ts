import { Module } from "@nestjs/common";
import { Galaxy2Domain062Controller } from "./galaxy-2-domain-062.controller";
import { Galaxy2Domain062Service } from "./galaxy-2-domain-062.service";

@Module({
  controllers: [Galaxy2Domain062Controller],
  providers: [Galaxy2Domain062Service],
  exports: [Galaxy2Domain062Service],
})
export class Galaxy2Domain062Module {}