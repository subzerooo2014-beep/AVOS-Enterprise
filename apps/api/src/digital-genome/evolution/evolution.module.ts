import { Module } from "@nestjs/common";
import { DigitalGenomeEvolutionController } from "./evolution.controller";
import { DigitalGenomeEvolutionService } from "./evolution.service";

@Module({
  controllers: [DigitalGenomeEvolutionController],
  providers: [DigitalGenomeEvolutionService],
  exports: [DigitalGenomeEvolutionService],
})
export class DigitalGenomeEvolutionModule {}