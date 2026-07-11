export declare class PublisherWorkerPoolService {
    private readonly workers;
    register(id: string): void;
    heartbeat(id: string): void;
    unregister(id: string): void;
    list(): {
        id: string;
        lastSeen: Date;
    }[];
}
