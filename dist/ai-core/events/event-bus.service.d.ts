export declare class EventBusService {
    publish(event: string, payload: any): {
        event: string;
        payload: any;
        publishedAt: string;
    };
}
