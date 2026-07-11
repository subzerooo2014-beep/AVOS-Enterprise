import { Injectable } from "@nestjs/common";
import { InvoiceNotFoundException } from "./receive-payment.errors";

@Injectable()
export class ReceivePaymentDomainService {
  ensureInvoiceExists(invoice: unknown) {
    if (!invoice) {
      throw new InvoiceNotFoundException();
    }
  }
}
