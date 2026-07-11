import { ExternalDeliveryService } from "../external-connectors/external-delivery.service";
import { SocialDeliveryChannel, SocialDeliveryResult } from "./social-delivery.contracts";
export declare class SocialHttpDeliveryService {
    private readonly externalDelivery;
    private readonly logger;
    constructor(externalDelivery: ExternalDeliveryService);
    deliver(input: {
        channel: SocialDeliveryChannel;
        eventId: string;
        payload: any;
        attempt: number;
    }): Promise<SocialDeliveryResult>;
}
