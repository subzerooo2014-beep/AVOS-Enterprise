import { BadRequestException, NotFoundException } from "@nestjs/common";

export class OrderNotFoundException extends NotFoundException {
  constructor() {
    super("Order not found");
  }
}

export class OrderAlreadyInvoicedException extends BadRequestException {
  constructor() {
    super("Order already has an invoice");
  }
}

export class OrderNotInvoiceableException extends BadRequestException {
  constructor() {
    super("Order cannot be invoiced");
  }
}
