import { Module } from "@nestjs/common";
import { Galaxy2Domain091Controller } from "./galaxy-2-domain-091.controller";
import { Galaxy2Domain091Service } from "./galaxy-2-domain-091.service";

@Module({
  controllers: [Galaxy2Domain091Controller],
  providers: [Galaxy2Domain091Service],
  exports: [Galaxy2Domain091Service],
})
export class Galaxy2Domain091Module {}