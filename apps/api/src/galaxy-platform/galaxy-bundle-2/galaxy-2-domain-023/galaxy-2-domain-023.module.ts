import { Module } from "@nestjs/common";
import { Galaxy2Domain023Controller } from "./galaxy-2-domain-023.controller";
import { Galaxy2Domain023Service } from "./galaxy-2-domain-023.service";

@Module({
  controllers: [Galaxy2Domain023Controller],
  providers: [Galaxy2Domain023Service],
  exports: [Galaxy2Domain023Service],
})
export class Galaxy2Domain023Module {}