import { EventBusService } from "../../../event-bus/event-bus.service";
import { CancelReservationCommand } from "./dto/cancel-reservation.command";
import { CancelReservationResponse } from "./dto/cancel-reservation.response";
import { CancelReservationPolicy } from "./domain/cancel-reservation.policy";
import { CancelReservationDomainService } from "./domain/cancel-reservation.domain-service";
import { CancelReservationRepository } from "./infrastructure/cancel-reservation.repository";
export declare class CancelReservationHandler {
    private readonly policy;
    private readonly domain;
    private readonly repository;
    private readonly eventBus;
    constructor(policy: CancelReservationPolicy, domain: CancelReservationDomainService, repository: CancelReservationRepository, eventBus: EventBusService);
    execute(command: CancelReservationCommand): Promise<CancelReservationResponse>;
}
