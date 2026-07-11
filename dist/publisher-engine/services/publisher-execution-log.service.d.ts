export declare class PublisherExecutionLogService {
    private readonly logs;
    write(entry: any): void;
    latest(limit?: number): any[];
}
