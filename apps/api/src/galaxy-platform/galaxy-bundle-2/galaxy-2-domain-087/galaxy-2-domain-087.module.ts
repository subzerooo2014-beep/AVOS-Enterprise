import { Module } from "@nestjs/common";
import { Galaxy2Domain087Controller } from "./galaxy-2-domain-087.controller";
import { Galaxy2Domain087Service } from "./galaxy-2-domain-087.service";

@Module({
  controllers: [Galaxy2Domain087Controller],
  providers: [Galaxy2Domain087Service],
  exports: [Galaxy2Domain087Service],
})
export class Galaxy2Domain087Module {}