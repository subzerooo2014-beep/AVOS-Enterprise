import { Module } from "@nestjs/common";
import { CommerceV1Controller } from "./commerce-v1.controller";
import { CommerceV1Service } from "./commerce-v1.service";

@Module({
  controllers: [CommerceV1Controller],
  providers: [CommerceV1Service],
  exports: [CommerceV1Service],
})
export class CommerceV1Module {}