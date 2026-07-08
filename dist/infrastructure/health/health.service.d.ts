export declare class HealthService {
    check(): {
        status: string;
        timestamp: string;
        services: {
            api: string;
            database: string;
            redis: string;
            queue: string;
        };
    };
}
