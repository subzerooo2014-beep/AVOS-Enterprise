import { Module } from "@nestjs/common";
import { Galaxy2Domain024Controller } from "./galaxy-2-domain-024.controller";
import { Galaxy2Domain024Service } from "./galaxy-2-domain-024.service";

@Module({
  controllers: [Galaxy2Domain024Controller],
  providers: [Galaxy2Domain024Service],
  exports: [Galaxy2Domain024Service],
})
export class Galaxy2Domain024Module {}