import { Module } from "@nestjs/common";
import { ProductionHardeningV7MegaPack15Controller } from "./production-hardening-v7-mega-pack-15.controller";
import { ProductionHardeningV7MegaPack15Service } from "./production-hardening-v7-mega-pack-15.service";

@Module({
  controllers: [
    ProductionHardeningV7MegaPack15Controller,
  ],
  providers: [
    ProductionHardeningV7MegaPack15Service,
  ],
  exports: [
    ProductionHardeningV7MegaPack15Service,
  ],
})
export class ProductionHardeningV7MegaPack15Module {}
