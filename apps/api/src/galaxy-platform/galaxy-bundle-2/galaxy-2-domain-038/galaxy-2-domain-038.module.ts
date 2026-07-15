import { Module } from "@nestjs/common";
import { Galaxy2Domain038Controller } from "./galaxy-2-domain-038.controller";
import { Galaxy2Domain038Service } from "./galaxy-2-domain-038.service";

@Module({
  controllers: [Galaxy2Domain038Controller],
  providers: [Galaxy2Domain038Service],
  exports: [Galaxy2Domain038Service],
})
export class Galaxy2Domain038Module {}