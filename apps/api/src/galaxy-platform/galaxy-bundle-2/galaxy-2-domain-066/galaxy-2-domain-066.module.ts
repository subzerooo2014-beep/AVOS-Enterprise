import { Module } from "@nestjs/common";
import { Galaxy2Domain066Controller } from "./galaxy-2-domain-066.controller";
import { Galaxy2Domain066Service } from "./galaxy-2-domain-066.service";

@Module({
  controllers: [Galaxy2Domain066Controller],
  providers: [Galaxy2Domain066Service],
  exports: [Galaxy2Domain066Service],
})
export class Galaxy2Domain066Module {}