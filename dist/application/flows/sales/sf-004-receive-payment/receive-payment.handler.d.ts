import { EventBusService } from "../../../../event-bus/event-bus.service";
import { ReceivePaymentCommand } from "./dto/receive-payment.command";
import { ReceivePaymentResponse } from "./dto/receive-payment.response";
import { ReceivePaymentDomainService } from "./domain/receive-payment.domain-service";
import { ReceivePaymentPolicy } from "./domain/receive-payment.policy";
import { ReceivePaymentRepository } from "./infrastructure/receive-payment.repository";
export declare class ReceivePaymentHandler {
    private readonly repository;
    private readonly domain;
    private readonly policy;
    private readonly eventBus;
    constructor(repository: ReceivePaymentRepository, domain: ReceivePaymentDomainService, policy: ReceivePaymentPolicy, eventBus: EventBusService);
    execute(command: ReceivePaymentCommand): Promise<ReceivePaymentResponse>;
}
