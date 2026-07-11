import { WebhookReceiptService } from "./webhook-receipt.service";
export declare class WebhookReceiverController {
    private readonly receipt;
    constructor(receipt: WebhookReceiptService);
    receive(channel: string, body: any, signature?: string, headerReceiptId?: string): Promise<any>;
    private channel;
}
