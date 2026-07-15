import { Module } from "@nestjs/common";
import { Galaxy2Domain035Controller } from "./galaxy-2-domain-035.controller";
import { Galaxy2Domain035Service } from "./galaxy-2-domain-035.service";

@Module({
  controllers: [Galaxy2Domain035Controller],
  providers: [Galaxy2Domain035Service],
  exports: [Galaxy2Domain035Service],
})
export class Galaxy2Domain035Module {}