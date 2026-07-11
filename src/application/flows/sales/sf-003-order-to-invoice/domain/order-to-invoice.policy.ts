import { Injectable } from "@nestjs/common";
import {
  OrderAlreadyInvoicedException,
  OrderNotInvoiceableException,
} from "./order-to-invoice.errors";

@Injectable()
export class OrderToInvoicePolicy {
  ensureNotInvoiced(invoice: unknown) {
    if (invoice) {
      throw new OrderAlreadyInvoicedException();
    }
  }

  ensureInvoiceable(status: string) {
    if (status === "CANCELLED" || status === "VOID") {
      throw new OrderNotInvoiceableException();
    }
  }
}
