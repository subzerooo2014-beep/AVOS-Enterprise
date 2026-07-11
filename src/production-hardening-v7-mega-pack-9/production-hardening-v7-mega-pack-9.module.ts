import { Module } from "@nestjs/common";
import { ProductionHardeningV7MegaPack9Controller } from "./production-hardening-v7-mega-pack-9.controller";
import { ProductionHardeningV7MegaPack9Service } from "./production-hardening-v7-mega-pack-9.service";

@Module({
  controllers: [ProductionHardeningV7MegaPack9Controller],
  providers: [ProductionHardeningV7MegaPack9Service],
  exports: [ProductionHardeningV7MegaPack9Service],
})
export class ProductionHardeningV7MegaPack9Module {}
