import { Module } from "@nestjs/common";
import { Galaxy2Domain008Controller } from "./galaxy-2-domain-008.controller";
import { Galaxy2Domain008Service } from "./galaxy-2-domain-008.service";

@Module({
  controllers: [Galaxy2Domain008Controller],
  providers: [Galaxy2Domain008Service],
  exports: [Galaxy2Domain008Service],
})
export class Galaxy2Domain008Module {}