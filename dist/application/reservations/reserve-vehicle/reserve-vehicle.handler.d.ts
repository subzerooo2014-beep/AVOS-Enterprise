import { ReserveVehicleCommand } from "./dto/reserve-vehicle.command";
import { ReserveVehicleResponse } from "./dto/reserve-vehicle.response";
import { ReserveVehiclePolicy } from "./domain/reserve-vehicle.policy";
import { ReserveVehicleDomainService } from "./domain/reserve-vehicle.domain-service";
import { ReserveVehicleRepository } from "./infrastructure/reserve-vehicle.repository";
import { EventBusService } from "../../../event-bus/event-bus.service";
export declare class ReserveVehicleHandler {
    private readonly policy;
    private readonly domain;
    private readonly repository;
    private readonly eventBus;
    constructor(policy: ReserveVehiclePolicy, domain: ReserveVehicleDomainService, repository: ReserveVehicleRepository, eventBus: EventBusService);
    execute(command: ReserveVehicleCommand): Promise<ReserveVehicleResponse>;
}
