import { OrderToInvoiceCommand } from "./dto/order-to-invoice.command";
import { OrderToInvoiceHandler } from "./order-to-invoice.handler";
export declare class OrderToInvoiceController {
    private readonly handler;
    constructor(handler: OrderToInvoiceHandler);
    execute(command: OrderToInvoiceCommand): Promise<import("./dto/order-to-invoice.response").OrderToInvoiceResponse>;
}
