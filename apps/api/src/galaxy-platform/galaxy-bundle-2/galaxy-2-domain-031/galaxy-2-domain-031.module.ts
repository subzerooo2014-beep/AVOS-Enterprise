import { Module } from "@nestjs/common";
import { Galaxy2Domain031Controller } from "./galaxy-2-domain-031.controller";
import { Galaxy2Domain031Service } from "./galaxy-2-domain-031.service";

@Module({
  controllers: [Galaxy2Domain031Controller],
  providers: [Galaxy2Domain031Service],
  exports: [Galaxy2Domain031Service],
})
export class Galaxy2Domain031Module {}