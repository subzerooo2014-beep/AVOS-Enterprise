import { Injectable } from "@nestjs/common";
import {
  QuoteAlreadyConvertedException,
  QuoteCustomerMissingException,
  QuoteNotConvertibleException,
} from "./quote-to-sales-order.errors";

@Injectable()
export class QuoteToSalesOrderPolicy {
  ensureHasCustomer(customerId: string | null) {
    if (!customerId) {
      throw new QuoteCustomerMissingException();
    }
  }

  ensureNotConverted(order: unknown) {
    if (order) {
      throw new QuoteAlreadyConvertedException();
    }
  }

  ensureConvertible(status: string) {
    if (status === "CANCELLED" || status === "EXPIRED") {
      throw new QuoteNotConvertibleException();
    }
  }
}
