import { Injectable } from "@nestjs/common";
import { QuoteNotFoundException } from "./quote-to-sales-order.errors";

@Injectable()
export class QuoteToSalesOrderDomainService {
  ensureQuoteExists(quote: unknown) {
    if (!quote) {
      throw new QuoteNotFoundException();
    }
  }
}
