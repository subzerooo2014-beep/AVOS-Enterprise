import { BadRequestException, NotFoundException } from "@nestjs/common";

export class QuoteNotFoundException extends NotFoundException {
  constructor() {
    super("Quote not found");
  }
}

export class QuoteCustomerMissingException extends BadRequestException {
  constructor() {
    super("Quote must have a customer before conversion");
  }
}

export class QuoteAlreadyConvertedException extends BadRequestException {
  constructor() {
    super("Quote already converted to order");
  }
}

export class QuoteNotConvertibleException extends BadRequestException {
  constructor() {
    super("Quote is not convertible");
  }
}
