import { Module } from "@nestjs/common";
import { Galaxy2Domain052Controller } from "./galaxy-2-domain-052.controller";
import { Galaxy2Domain052Service } from "./galaxy-2-domain-052.service";

@Module({
  controllers: [Galaxy2Domain052Controller],
  providers: [Galaxy2Domain052Service],
  exports: [Galaxy2Domain052Service],
})
export class Galaxy2Domain052Module {}