import { ReceivePaymentCommand } from "./dto/receive-payment.command";
import { ReceivePaymentHandler } from "./receive-payment.handler";
export declare class ReceivePaymentController {
    private readonly handler;
    constructor(handler: ReceivePaymentHandler);
    execute(command: ReceivePaymentCommand): Promise<import("./dto/receive-payment.response").ReceivePaymentResponse>;
}
