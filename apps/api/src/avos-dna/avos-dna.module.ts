import { Module } from "@nestjs/common";
import { AvosDnaController } from "./avos-dna.controller";
import { AvosDnaService } from "./avos-dna.service";

@Module({
  controllers: [AvosDnaController],
  providers: [AvosDnaService],
  exports: [AvosDnaService],
})
export class AvosDnaModule {}
