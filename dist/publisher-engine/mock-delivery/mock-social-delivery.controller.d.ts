import { MockSocialDeliveryService } from "./mock-social-delivery.service";
export declare class MockSocialDeliveryController {
    private readonly service;
    constructor(service: MockSocialDeliveryService);
    deliver(channel: string, body: any, headers: Record<string, any>): {
        success: boolean;
        delivered: boolean;
        mock: boolean;
        channel: string;
        externalId: string;
        eventId: any;
        received: {
            accountId: any;
            attempt: any;
            hasPayload: boolean;
            hasPublication: boolean;
            hasCampaign: boolean;
            vehicleId: any;
        };
        deliveredAt: string;
    };
}
