import { Module } from "@nestjs/common";
import { EventBusModule } from "../../../event-bus/event-bus.module";
import { ReserveVehicleController } from "./reserve-vehicle.controller";
import { ReserveVehicleHandler } from "./reserve-vehicle.handler";
import { ReserveVehiclePolicy } from "./domain/reserve-vehicle.policy";
import { ReserveVehicleDomainService } from "./domain/reserve-vehicle.domain-service";
import { ReserveVehicleRepository } from "./infrastructure/reserve-vehicle.repository";

@Module({
  imports: [EventBusModule],
  controllers: [ReserveVehicleController],
  providers: [
    ReserveVehicleHandler,
    ReserveVehiclePolicy,
    ReserveVehicleDomainService,
    ReserveVehicleRepository,
  ],
  exports: [ReserveVehicleHandler],
})
export class ReserveVehicleModule {}
