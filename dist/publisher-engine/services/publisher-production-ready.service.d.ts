export declare class PublisherProductionReadyService {
    check(): {
        success: boolean;
        engine: string;
        production: boolean;
        queue: boolean;
        routing: boolean;
        metrics: boolean;
        monitoring: boolean;
        ai: boolean;
        generatedAt: Date;
    };
}
