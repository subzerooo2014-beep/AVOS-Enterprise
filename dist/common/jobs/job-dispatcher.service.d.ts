export declare class JobDispatcherService {
    dispatch(name: string, payload: unknown): {
        job: string;
        queued: boolean;
        payload: unknown;
    };
}
