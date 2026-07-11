import { Module } from "@nestjs/common";
import { ProductionHardeningV7MegaPack11Controller } from "./production-hardening-v7-mega-pack-11.controller";
import { ProductionHardeningV7MegaPack11Service } from "./production-hardening-v7-mega-pack-11.service";

@Module({
  controllers: [
    ProductionHardeningV7MegaPack11Controller,
  ],
  providers: [
    ProductionHardeningV7MegaPack11Service,
  ],
  exports: [
    ProductionHardeningV7MegaPack11Service,
  ],
})
export class ProductionHardeningV7MegaPack11Module {}
