import { Module } from "@nestjs/common";
import { Galaxy2Domain020Controller } from "./galaxy-2-domain-020.controller";
import { Galaxy2Domain020Service } from "./galaxy-2-domain-020.service";

@Module({
  controllers: [Galaxy2Domain020Controller],
  providers: [Galaxy2Domain020Service],
  exports: [Galaxy2Domain020Service],
})
export class Galaxy2Domain020Module {}