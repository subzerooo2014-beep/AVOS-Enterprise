import { Module } from "@nestjs/common";
import { ProductionHardeningV7MegaPack12Controller } from "./production-hardening-v7-mega-pack-12.controller";
import { ProductionHardeningV7MegaPack12Service } from "./production-hardening-v7-mega-pack-12.service";

@Module({
  controllers: [
    ProductionHardeningV7MegaPack12Controller,
  ],
  providers: [
    ProductionHardeningV7MegaPack12Service,
  ],
  exports: [
    ProductionHardeningV7MegaPack12Service,
  ],
})
export class ProductionHardeningV7MegaPack12Module {}
