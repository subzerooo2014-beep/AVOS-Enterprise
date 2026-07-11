import { Module } from "@nestjs/common";
import { EventBusModule } from "../../../../event-bus/event-bus.module";
import { ReceivePaymentController } from "./receive-payment.controller";
import { ReceivePaymentHandler } from "./receive-payment.handler";
import { ReceivePaymentDomainService } from "./domain/receive-payment.domain-service";
import { ReceivePaymentPolicy } from "./domain/receive-payment.policy";
import { ReceivePaymentRepository } from "./infrastructure/receive-payment.repository";

@Module({
  imports: [EventBusModule],
  controllers: [ReceivePaymentController],
  providers: [
    ReceivePaymentHandler,
    ReceivePaymentDomainService,
    ReceivePaymentPolicy,
    ReceivePaymentRepository,
  ],
  exports: [ReceivePaymentHandler],
})
export class Sf004ReceivePaymentModule {}
