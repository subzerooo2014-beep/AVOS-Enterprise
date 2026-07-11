import { Module } from "@nestjs/common";
import { ProductionHardeningV8MegaPack2Controller } from "./production-hardening-v8-mega-pack-2.controller";
import { ProductionHardeningV8MegaPack2Service } from "./production-hardening-v8-mega-pack-2.service";

@Module({
  controllers: [
    ProductionHardeningV8MegaPack2Controller,
  ],
  providers: [
    ProductionHardeningV8MegaPack2Service,
  ],
  exports: [
    ProductionHardeningV8MegaPack2Service,
  ],
})
export class ProductionHardeningV8MegaPack2Module {}
