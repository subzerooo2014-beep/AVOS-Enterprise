import { Module } from "@nestjs/common";
import { ProductionHardeningV7MegaPack7Controller } from "./production-hardening-v7-mega-pack-7.controller";
import { ProductionHardeningV7MegaPack7Service } from "./production-hardening-v7-mega-pack-7.service";
import { ProductionHardeningV7MegaPack7Store } from "./production-hardening-v7-mega-pack-7.store";

@Module({
  controllers: [
    ProductionHardeningV7MegaPack7Controller,
  ],
  providers: [
    ProductionHardeningV7MegaPack7Store,
    ProductionHardeningV7MegaPack7Service,
  ],
  exports: [
    ProductionHardeningV7MegaPack7Service,
  ],
})
export class ProductionHardeningV7MegaPack7Module {}
