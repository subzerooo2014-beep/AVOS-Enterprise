import { Module } from "@nestjs/common";
import { DigitalDnaEvolutionController } from "./evolution.controller";
import { DigitalDnaEvolutionService } from "./evolution.service";

@Module({
  controllers: [DigitalDnaEvolutionController],
  providers: [DigitalDnaEvolutionService],
  exports: [DigitalDnaEvolutionService],
})
export class DigitalDnaEvolutionModule {}