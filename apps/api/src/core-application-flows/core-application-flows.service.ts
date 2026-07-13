import { BadRequestException, Injectable } from "@nestjs/common";
import { QuotesService } from "../quotes/quotes.service";
import { OrdersService } from "../orders/orders.service";
import { InvoicesService } from "../invoices/invoices.service";
import { PaymentsService } from "../payments/payments.service";
import { ReservationsService } from "../reservations/reservations.service";
import { InventoryService } from "../inventory/inventory.service";
import { SalesService } from "../sales/sales.service";
import { EventsService } from "../events/events.service";
import { WorkflowsService } from "../workflows/workflows.service";
import { CoreFlowRegistryService } from "./core-flow-registry.service";
import {
  requireText,
  resolveIdempotencyKey,
} from "./core-flow.utils";

@Injectable()
export class CoreApplicationFlowsService {
  constructor(
    private readonly quotes: QuotesService,
    private readonly orders: OrdersService,
    private readonly invoices: InvoicesService,
    private readonly payments: PaymentsService,
    private readonly reservations: ReservationsService,
    private readonly inventory: InventoryService,
    private readonly sales: SalesService,
    private readonly events: EventsService,
    private readonly workflows: WorkflowsService,
    private readonly registry: CoreFlowRegistryService,
  ) {}

  async quoteToCash(dto: any) {
    const quoteId = requireText(dto?.quoteId, "quoteId");
    const correlationId = resolveIdempotencyKey(dto?.correlationId, [
      "quote-to-cash",
      quoteId,
      dto?.customerId,
      dto?.paymentReference,
    ]);

    const execution = this.registry.start("quote-to-cash", correlationId, dto ?? {});
    if (execution.status === "completed") return execution;

    const workflow = this.workflows.create({
      name: "quote-to-cash",
      steps: [
        { name: "quote-to-order" },
        { name: "confirm-order" },
        { name: "order-to-invoice" },
        { name: "issue-invoice" },
        { name: "invoice-to-payment" },
        { name: "publish-completion" },
      ],
    });

    try {
      const orderEnvelope: any = await this.quotes.convertToOrder(quoteId, {
        ...dto?.order,
        customerId: dto?.customerId,
        idempotencyKey: `${correlationId}:order`,
      });
      const order = orderEnvelope.result?.order ?? orderEnvelope.order;
      this.workflows.completeStep(workflow.id, "quote-to-order", order);

      const confirmedOrder = await this.orders.confirm(order.id);
      this.workflows.completeStep(workflow.id, "confirm-order", confirmedOrder);

      const invoiceEnvelope: any = await this.orders.createInvoice(order.id, {
        ...dto?.invoice,
        customerId: dto?.customerId,
        idempotencyKey: `${correlationId}:invoice`,
      });
      const invoice = invoiceEnvelope.result?.invoice ?? invoiceEnvelope.invoice;
      this.workflows.completeStep(workflow.id, "order-to-invoice", invoice);

      const issuedInvoice = invoice.status === "DRAFT"
        ? await this.invoices.issue(invoice.id)
        : invoice;
      this.workflows.completeStep(workflow.id, "issue-invoice", issuedInvoice);

      const paymentEnvelope = await this.invoices.registerPayment(invoice.id, {
        ...dto?.payment,
        amount: dto?.payment?.amount ?? invoice.total,
        reference: dto?.paymentReference,
        idempotencyKey: `${correlationId}:payment`,
      });
      this.workflows.completeStep(workflow.id, "invoice-to-payment", paymentEnvelope);

      const event = this.events.create({
        type: "QuoteToCashCompleted",
        aggregateType: "Quote",
        aggregateId: quoteId,
        payload: {
          correlationId,
          orderId: order.id,
          invoiceId: invoice.id,
        },
      });
      this.workflows.completeStep(workflow.id, "publish-completion", event);

      return this.registry.complete(execution.id, {
        correlationId,
        quoteId,
        order,
        invoice,
        payment: paymentEnvelope,
        workflow: this.workflows.findOne(workflow.id),
        event,
      });
    } catch (error) {
      this.workflows.fail(workflow.id, error);
      this.registry.fail(execution.id, error);
      throw error;
    }
  }

  async reservationToSale(dto: any) {
    const reservationId = requireText(dto?.reservationId, "reservationId");
    const inventoryId = requireText(dto?.inventoryId, "inventoryId");
    const correlationId = resolveIdempotencyKey(dto?.correlationId, [
      "reservation-to-sale",
      reservationId,
      inventoryId,
      dto?.customerId,
    ]);

    const execution = this.registry.start("reservation-to-sale", correlationId, dto ?? {});
    if (execution.status === "completed") return execution;

    const workflow = this.workflows.create({
      name: "reservation-to-sale",
      steps: [
        { name: "confirm-reservation" },
        { name: "reserve-inventory" },
        { name: "create-sale" },
        { name: "approve-sale" },
        { name: "finalize-sale" },
        { name: "release-reservation" },
      ],
    });

    try {
      const reservation = await this.reservations.findOne(reservationId);
      const confirmed = reservation.status === "PENDING"
        ? await this.reservations.confirm(reservationId)
        : reservation;
      this.workflows.completeStep(workflow.id, "confirm-reservation", confirmed);

      const inventory = await this.inventory.reserve(inventoryId, {
        reservationId,
        quantity: dto?.quantity ?? 1,
        idempotencyKey: `${correlationId}:inventory-reserve`,
      });
      this.workflows.completeStep(workflow.id, "reserve-inventory", inventory);

      const sale = await this.sales.create({
        ...dto?.sale,
        customerId: dto?.customerId ?? reservation.customerId,
        vehicleId: dto?.vehicleId ?? reservation.vehicleId,
        status: "DRAFT",
      });
      this.workflows.completeStep(workflow.id, "create-sale", sale);

      await this.sales.submit(sale.id);
      const approved = await this.sales.approve(sale.id);
      this.workflows.completeStep(workflow.id, "approve-sale", approved);

      const finalized = await this.sales.finalizeDeal(sale.id, {
        inventoryId,
        salePrice: dto?.salePrice ?? sale.total,
        idempotencyKey: `${correlationId}:finalize`,
      });
      this.workflows.completeStep(workflow.id, "finalize-sale", finalized);

      const released = await this.reservations.release(reservationId, {
        reason: "Converted to completed sale",
      });
      this.workflows.completeStep(workflow.id, "release-reservation", released);

      return this.registry.complete(execution.id, {
        correlationId,
        reservation: released,
        sale: finalized,
        workflow: this.workflows.findOne(workflow.id),
      });
    } catch (error) {
      this.workflows.fail(workflow.id, error);
      this.registry.fail(execution.id, error);
      throw error;
    }
  }

  async replay(id: string) {
    const entry = this.registry.findOne(id);
    if (entry.status !== "failed") {
      throw new BadRequestException("Only failed flow executions can be replayed.");
    }

    this.registry.retry(id);
    if (entry.flow === "quote-to-cash") {
      return this.quoteToCash({ ...entry.input, correlationId: entry.correlationId });
    }
    if (entry.flow === "reservation-to-sale") {
      return this.reservationToSale({ ...entry.input, correlationId: entry.correlationId });
    }

    throw new BadRequestException(`Unsupported flow '${entry.flow}'.`);
  }

  dashboard() {
    return {
      registry: this.registry.dashboard(),
      workflows: this.workflows.findAll(),
      events: this.events.findAll().slice(0, 50),
      generatedAt: new Date().toISOString(),
    };
  }
}
