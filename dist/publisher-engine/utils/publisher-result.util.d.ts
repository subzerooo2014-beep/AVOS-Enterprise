export declare class PublisherResultUtil {
    static published(channel: string, externalId: string, metadata?: any): {
        status: string;
        channel: string;
        externalId: string;
        message: string;
        metadata: any;
    };
    static failed(channel: string, message: string, metadata?: any): {
        status: string;
        channel: string;
        message: string;
        metadata: any;
    };
    static skipped(channel: string, reason: string): {
        status: string;
        channel: string;
        message: string;
        metadata: {};
    };
}
