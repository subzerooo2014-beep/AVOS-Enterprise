import { Module } from "@nestjs/common";
import { Galaxy2Domain077Controller } from "./galaxy-2-domain-077.controller";
import { Galaxy2Domain077Service } from "./galaxy-2-domain-077.service";

@Module({
  controllers: [Galaxy2Domain077Controller],
  providers: [Galaxy2Domain077Service],
  exports: [Galaxy2Domain077Service],
})
export class Galaxy2Domain077Module {}