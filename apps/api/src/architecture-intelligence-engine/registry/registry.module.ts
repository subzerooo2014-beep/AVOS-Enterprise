import { Module } from "@nestjs/common";
import { ArchitectureRegistryController } from "./registry.controller";
import { ArchitectureRegistryService } from "./registry.service";

@Module({
  controllers: [ArchitectureRegistryController],
  providers: [ArchitectureRegistryService],
  exports: [ArchitectureRegistryService],
})
export class ArchitectureRegistryModule {}