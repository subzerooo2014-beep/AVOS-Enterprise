export declare class EventDispatcherService {
    dispatch(event: string, payload: unknown): {
        event: string;
        payload: unknown;
        dispatchedAt: string;
    };
}
