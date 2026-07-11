import { Injectable } from "@nestjs/common";
import {
  InvalidPaymentAmountException,
  InvoiceAlreadyPaidException,
} from "./receive-payment.errors";

@Injectable()
export class ReceivePaymentPolicy {
  ensureInvoicePayable(invoice: { status: string; balance: number }) {
    if (invoice.status === "PAID" || invoice.balance <= 0) {
      throw new InvoiceAlreadyPaidException();
    }
  }

  ensureValidAmount(amount: number, balance: number) {
    if (amount <= 0 || amount > balance) {
      throw new InvalidPaymentAmountException();
    }
  }

  calculateAfterPayment(invoice: { paidAmount: number; balance: number }, amount: number) {
    const paidAmount = invoice.paidAmount + amount;
    const balance = invoice.balance - amount;
    const status = balance <= 0 ? "PAID" : "PARTIALLY_PAID";

    return {
      paidAmount,
      balance,
      status,
    };
  }
}
