import { Module } from "@nestjs/common";
import { Galaxy2Domain043Controller } from "./galaxy-2-domain-043.controller";
import { Galaxy2Domain043Service } from "./galaxy-2-domain-043.service";

@Module({
  controllers: [Galaxy2Domain043Controller],
  providers: [Galaxy2Domain043Service],
  exports: [Galaxy2Domain043Service],
})
export class Galaxy2Domain043Module {}