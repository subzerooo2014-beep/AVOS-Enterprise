import { Module } from "@nestjs/common";
import { ProductionHardeningV7MegaPack13Controller } from "./production-hardening-v7-mega-pack-13.controller";
import { ProductionHardeningV7MegaPack13Service } from "./production-hardening-v7-mega-pack-13.service";

@Module({
  controllers: [
    ProductionHardeningV7MegaPack13Controller,
  ],
  providers: [
    ProductionHardeningV7MegaPack13Service,
  ],
  exports: [
    ProductionHardeningV7MegaPack13Service,
  ],
})
export class ProductionHardeningV7MegaPack13Module {}
