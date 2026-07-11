import { Module } from "@nestjs/common";
import { ProductionHardeningV8MegaPack1Controller } from "./production-hardening-v8-mega-pack-1.controller";
import { ProductionHardeningV8MegaPack1Service } from "./production-hardening-v8-mega-pack-1.service";

@Module({
  controllers: [
    ProductionHardeningV8MegaPack1Controller,
  ],
  providers: [
    ProductionHardeningV8MegaPack1Service,
  ],
  exports: [
    ProductionHardeningV8MegaPack1Service,
  ],
})
export class ProductionHardeningV8MegaPack1Module {}
