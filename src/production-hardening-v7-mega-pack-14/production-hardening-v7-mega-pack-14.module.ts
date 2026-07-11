import { Module } from "@nestjs/common";
import { ProductionHardeningV7MegaPack14Controller } from "./production-hardening-v7-mega-pack-14.controller";
import { ProductionHardeningV7MegaPack14Service } from "./production-hardening-v7-mega-pack-14.service";

@Module({
  controllers: [
    ProductionHardeningV7MegaPack14Controller,
  ],
  providers: [
    ProductionHardeningV7MegaPack14Service,
  ],
  exports: [
    ProductionHardeningV7MegaPack14Service,
  ],
})
export class ProductionHardeningV7MegaPack14Module {}
