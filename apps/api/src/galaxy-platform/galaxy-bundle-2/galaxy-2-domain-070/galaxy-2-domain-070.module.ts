import { Module } from "@nestjs/common";
import { Galaxy2Domain070Controller } from "./galaxy-2-domain-070.controller";
import { Galaxy2Domain070Service } from "./galaxy-2-domain-070.service";

@Module({
  controllers: [Galaxy2Domain070Controller],
  providers: [Galaxy2Domain070Service],
  exports: [Galaxy2Domain070Service],
})
export class Galaxy2Domain070Module {}