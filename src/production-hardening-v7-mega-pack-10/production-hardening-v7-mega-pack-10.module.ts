import { Module } from "@nestjs/common";
import { ProductionHardeningV7MegaPack10Controller } from "./production-hardening-v7-mega-pack-10.controller";
import { ProductionHardeningV7MegaPack10Service } from "./production-hardening-v7-mega-pack-10.service";

@Module({
  controllers: [
    ProductionHardeningV7MegaPack10Controller,
  ],
  providers: [
    ProductionHardeningV7MegaPack10Service,
  ],
  exports: [
    ProductionHardeningV7MegaPack10Service,
  ],
})
export class ProductionHardeningV7MegaPack10Module {}
