import { Module } from "@nestjs/common";
import { DigitalGenomeCompositionController } from "./composition.controller";
import { DigitalGenomeCompositionService } from "./composition.service";

@Module({
  controllers: [DigitalGenomeCompositionController],
  providers: [DigitalGenomeCompositionService],
  exports: [DigitalGenomeCompositionService],
})
export class DigitalGenomeCompositionModule {}