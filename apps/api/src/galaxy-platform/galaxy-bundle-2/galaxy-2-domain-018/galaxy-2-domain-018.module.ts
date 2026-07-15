import { Module } from "@nestjs/common";
import { Galaxy2Domain018Controller } from "./galaxy-2-domain-018.controller";
import { Galaxy2Domain018Service } from "./galaxy-2-domain-018.service";

@Module({
  controllers: [Galaxy2Domain018Controller],
  providers: [Galaxy2Domain018Service],
  exports: [Galaxy2Domain018Service],
})
export class Galaxy2Domain018Module {}