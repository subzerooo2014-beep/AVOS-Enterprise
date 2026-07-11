import { Injectable } from "@nestjs/common";
import { EventBusService } from "../../../../event-bus/event-bus.service";
import { ReceivePaymentCommand } from "./dto/receive-payment.command";
import { ReceivePaymentResponse } from "./dto/receive-payment.response";
import { ReceivePaymentDomainService } from "./domain/receive-payment.domain-service";
import { ReceivePaymentPolicy } from "./domain/receive-payment.policy";
import { ReceivePaymentRepository } from "./infrastructure/receive-payment.repository";

@Injectable()
export class ReceivePaymentHandler {
  constructor(
    private readonly repository: ReceivePaymentRepository,
    private readonly domain: ReceivePaymentDomainService,
    private readonly policy: ReceivePaymentPolicy,
    private readonly eventBus: EventBusService,
  ) {}

  async execute(command: ReceivePaymentCommand): Promise<ReceivePaymentResponse> {
    const result = await this.repository.transaction(async (tx) => {
      const foundInvoice = await this.repository.findInvoice(tx, command.invoiceId);

      this.domain.ensureInvoiceExists(foundInvoice);

      const invoice = foundInvoice!;

      this.policy.ensureInvoicePayable({
        status: invoice.status,
        balance: invoice.balance,
      });

      this.policy.ensureValidAmount(command.amount, invoice.balance);

      const nextState = this.policy.calculateAfterPayment(
        {
          paidAmount: invoice.paidAmount,
          balance: invoice.balance,
        },
        command.amount,
      );

      const payment = await this.repository.createPayment(tx, {
        invoiceId: invoice.id,
        orderId: invoice.orderId,
        customerId: invoice.customerId,
        amount: command.amount,
        method: command.method,
        reference: command.reference,
        notes: command.notes,
      });

      const updatedInvoice = await this.repository.updateInvoicePaymentState(tx, {
        invoiceId: invoice.id,
        paidAmount: nextState.paidAmount,
        balance: nextState.balance,
        status: nextState.status,
      });

      await this.repository.createAudit(tx, {
        paymentId: payment.id,
        invoiceId: invoice.id,
        customerId: invoice.customerId,
      });

      return {
        payment,
        invoice: updatedInvoice,
      };
    });

    this.eventBus.publish("PaymentReceived", {
      paymentId: result.payment.id,
      invoiceId: result.invoice.id,
      amount: result.payment.amount,
      status: result.invoice.status,
    });

    return {
      invoiceId: result.invoice.id,
      paymentId: result.payment.id,
      amount: result.payment.amount,
      invoiceStatus: result.invoice.status,
      paidAmount: result.invoice.paidAmount,
      balance: result.invoice.balance,
    };
  }
}
