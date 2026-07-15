import { Module } from "@nestjs/common";
import { Galaxy2Domain085Controller } from "./galaxy-2-domain-085.controller";
import { Galaxy2Domain085Service } from "./galaxy-2-domain-085.service";

@Module({
  controllers: [Galaxy2Domain085Controller],
  providers: [Galaxy2Domain085Service],
  exports: [Galaxy2Domain085Service],
})
export class Galaxy2Domain085Module {}