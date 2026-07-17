import { Module } from "@nestjs/common";
import { DigitalGenomeHealthController } from "./health.controller";
import { DigitalGenomeHealthService } from "./health.service";

@Module({
  controllers: [DigitalGenomeHealthController],
  providers: [DigitalGenomeHealthService],
  exports: [DigitalGenomeHealthService],
})
export class DigitalGenomeHealthModule {}