export declare class PublisherWorkerService {
    private readonly workerId;
    id(): string;
    heartbeat(): {
        workerId: string;
        status: string;
        timestamp: Date;
    };
}
