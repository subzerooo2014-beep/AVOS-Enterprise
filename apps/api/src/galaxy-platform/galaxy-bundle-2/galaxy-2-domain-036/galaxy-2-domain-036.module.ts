import { Module } from "@nestjs/common";
import { Galaxy2Domain036Controller } from "./galaxy-2-domain-036.controller";
import { Galaxy2Domain036Service } from "./galaxy-2-domain-036.service";

@Module({
  controllers: [Galaxy2Domain036Controller],
  providers: [Galaxy2Domain036Service],
  exports: [Galaxy2Domain036Service],
})
export class Galaxy2Domain036Module {}