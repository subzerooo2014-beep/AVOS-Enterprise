import { PublisherWorkerPoolService } from "./publisher-worker-pool.service";
export declare class PublisherWorkerHealthService {
    private readonly pool;
    constructor(pool: PublisherWorkerPoolService);
    health(): {
        success: boolean;
        workers: {
            id: string;
            lastSeen: Date;
        }[];
        generatedAt: Date;
    };
}
