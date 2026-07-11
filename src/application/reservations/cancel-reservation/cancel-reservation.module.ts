import { Module } from "@nestjs/common";
import { EventBusModule } from "../../../event-bus/event-bus.module";
import { CancelReservationController } from "./cancel-reservation.controller";
import { CancelReservationHandler } from "./cancel-reservation.handler";
import { CancelReservationPolicy } from "./domain/cancel-reservation.policy";
import { CancelReservationDomainService } from "./domain/cancel-reservation.domain-service";
import { CancelReservationRepository } from "./infrastructure/cancel-reservation.repository";

@Module({
  imports:[
    EventBusModule
  ],
  controllers:[
    CancelReservationController
  ],
  providers:[
    CancelReservationHandler,
    CancelReservationPolicy,
    CancelReservationDomainService,
    CancelReservationRepository
  ],
  exports:[
    CancelReservationHandler
  ]
})
export class CancelReservationModule {}
