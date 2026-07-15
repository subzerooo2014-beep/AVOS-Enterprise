import { Module } from "@nestjs/common";
import { Galaxy2Domain026Controller } from "./galaxy-2-domain-026.controller";
import { Galaxy2Domain026Service } from "./galaxy-2-domain-026.service";

@Module({
  controllers: [Galaxy2Domain026Controller],
  providers: [Galaxy2Domain026Service],
  exports: [Galaxy2Domain026Service],
})
export class Galaxy2Domain026Module {}