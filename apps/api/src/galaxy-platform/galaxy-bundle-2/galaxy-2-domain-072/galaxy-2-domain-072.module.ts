import { Module } from "@nestjs/common";
import { Galaxy2Domain072Controller } from "./galaxy-2-domain-072.controller";
import { Galaxy2Domain072Service } from "./galaxy-2-domain-072.service";

@Module({
  controllers: [Galaxy2Domain072Controller],
  providers: [Galaxy2Domain072Service],
  exports: [Galaxy2Domain072Service],
})
export class Galaxy2Domain072Module {}