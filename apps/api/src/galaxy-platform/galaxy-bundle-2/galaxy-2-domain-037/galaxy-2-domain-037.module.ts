import { Module } from "@nestjs/common";
import { Galaxy2Domain037Controller } from "./galaxy-2-domain-037.controller";
import { Galaxy2Domain037Service } from "./galaxy-2-domain-037.service";

@Module({
  controllers: [Galaxy2Domain037Controller],
  providers: [Galaxy2Domain037Service],
  exports: [Galaxy2Domain037Service],
})
export class Galaxy2Domain037Module {}