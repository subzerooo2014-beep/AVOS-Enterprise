import { Module } from "@nestjs/common";
import { Galaxy2Domain025Controller } from "./galaxy-2-domain-025.controller";
import { Galaxy2Domain025Service } from "./galaxy-2-domain-025.service";

@Module({
  controllers: [Galaxy2Domain025Controller],
  providers: [Galaxy2Domain025Service],
  exports: [Galaxy2Domain025Service],
})
export class Galaxy2Domain025Module {}