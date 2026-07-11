import { PrismaService } from "../../prisma/prisma.service";
import { ConnectorSecurityChannel } from "../connector-security/connector-credential-vault.service";
import { ConnectorWebhookVerificationService } from "../connector-security/connector-webhook-verification.service";
interface WebhookReceiptInput {
    channel: ConnectorSecurityChannel;
    eventId?: string;
    receiptId?: string;
    success?: boolean;
    status?: string;
    externalId?: string | null;
    externalStatus?: string | null;
    errorCode?: string | null;
    errorMessage?: string | null;
    message?: string | null;
    payload?: any;
    rawBody: string;
    signature?: string;
    receivedAt?: Date;
}
export declare class WebhookReceiptService {
    private readonly prisma;
    private readonly verifier;
    private readonly logger;
    constructor(prisma: PrismaService, verifier: ConnectorWebhookVerificationService);
    receive(input: WebhookReceiptInput): Promise<any>;
    private verifySignatureIfRequired;
    private resolveStatus;
    private channelFromEventType;
    private auditAction;
    private requiredText;
    private optionalText;
    private objectOf;
}
export {};
