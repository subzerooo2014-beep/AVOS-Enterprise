import { Module } from "@nestjs/common";
import { DigitalGenomeRegistryController } from "./registry.controller";
import { DigitalGenomeRegistryService } from "./registry.service";

@Module({
  controllers: [DigitalGenomeRegistryController],
  providers: [DigitalGenomeRegistryService],
  exports: [DigitalGenomeRegistryService],
})
export class DigitalGenomeRegistryModule {}