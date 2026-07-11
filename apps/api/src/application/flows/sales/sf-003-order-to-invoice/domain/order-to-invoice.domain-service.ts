import { Injectable } from "@nestjs/common";
import { OrderNotFoundException } from "./order-to-invoice.errors";

@Injectable()
export class OrderToInvoiceDomainService {
  ensureOrderExists(order: unknown) {
    if (!order) {
      throw new OrderNotFoundException();
    }
  }

  createInvoiceNumber() {
    return `INV-${Date.now()}`;
  }
}
