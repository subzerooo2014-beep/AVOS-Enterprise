import { Module } from "@nestjs/common";
import { Galaxy2Domain017Controller } from "./galaxy-2-domain-017.controller";
import { Galaxy2Domain017Service } from "./galaxy-2-domain-017.service";

@Module({
  controllers: [Galaxy2Domain017Controller],
  providers: [Galaxy2Domain017Service],
  exports: [Galaxy2Domain017Service],
})
export class Galaxy2Domain017Module {}