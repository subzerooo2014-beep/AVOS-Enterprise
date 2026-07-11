import { Module } from "@nestjs/common";
import { ProductionHardeningV7MegaPack8Controller } from "./production-hardening-v7-mega-pack-8.controller";
import { ProductionHardeningV7MegaPack8Service } from "./production-hardening-v7-mega-pack-8.service";
import { ProductionHardeningV7MegaPack8Store } from "./production-hardening-v7-mega-pack-8.store";

@Module({
  controllers: [
    ProductionHardeningV7MegaPack8Controller,
  ],
  providers: [
    ProductionHardeningV7MegaPack8Store,
    ProductionHardeningV7MegaPack8Service,
  ],
  exports: [
    ProductionHardeningV7MegaPack8Service,
  ],
})
export class ProductionHardeningV7MegaPack8Module {}
