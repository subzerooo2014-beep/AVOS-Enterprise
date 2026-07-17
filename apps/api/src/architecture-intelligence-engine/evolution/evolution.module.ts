import { Module } from "@nestjs/common";
import { ArchitectureEvolutionController } from "./evolution.controller";
import { ArchitectureEvolutionService } from "./evolution.service";

@Module({
  controllers: [ArchitectureEvolutionController],
  providers: [ArchitectureEvolutionService],
  exports: [ArchitectureEvolutionService],
})
export class ArchitectureEvolutionModule {}