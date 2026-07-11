import { BadRequestException, NotFoundException } from "@nestjs/common";

export class InvoiceNotFoundException extends NotFoundException {
  constructor() {
    super("Invoice not found");
  }
}

export class InvoiceAlreadyPaidException extends BadRequestException {
  constructor() {
    super("Invoice already paid");
  }
}

export class InvalidPaymentAmountException extends BadRequestException {
  constructor() {
    super("Payment amount is invalid");
  }
}
