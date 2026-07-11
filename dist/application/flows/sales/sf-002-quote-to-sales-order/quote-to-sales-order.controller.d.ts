import { QuoteToSalesOrderCommand } from "./dto/quote-to-sales-order.command";
import { QuoteToSalesOrderHandler } from "./quote-to-sales-order.handler";
export declare class QuoteToSalesOrderController {
    private readonly handler;
    constructor(handler: QuoteToSalesOrderHandler);
    execute(command: QuoteToSalesOrderCommand): Promise<import("./dto/quote-to-sales-order.response").QuoteToSalesOrderResponse>;
}
