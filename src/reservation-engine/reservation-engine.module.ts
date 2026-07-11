import { Module } from "@nestjs/common";
import { ReservationEngineService } from "./reservation-engine.service";

@Module({
  providers:[ReservationEngineService],
  exports:[ReservationEngineService],
})
export class ReservationEngineModule {}
