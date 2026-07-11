import { Module } from "@nestjs/common";
import { ProductionHardeningV7MegaPack16Controller } from "./production-hardening-v7-mega-pack-16.controller";
import { ProductionHardeningV7MegaPack16Service } from "./production-hardening-v7-mega-pack-16.service";

@Module({
  controllers: [
    ProductionHardeningV7MegaPack16Controller,
  ],
  providers: [
    ProductionHardeningV7MegaPack16Service,
  ],
  exports: [
    ProductionHardeningV7MegaPack16Service,
  ],
})
export class ProductionHardeningV7MegaPack16Module {}
