import { Module } from "@nestjs/common";
import { Galaxy2Domain022Controller } from "./galaxy-2-domain-022.controller";
import { Galaxy2Domain022Service } from "./galaxy-2-domain-022.service";

@Module({
  controllers: [Galaxy2Domain022Controller],
  providers: [Galaxy2Domain022Service],
  exports: [Galaxy2Domain022Service],
})
export class Galaxy2Domain022Module {}