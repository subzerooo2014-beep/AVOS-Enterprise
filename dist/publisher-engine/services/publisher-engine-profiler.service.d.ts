import { PublisherVersionService } from "./publisher-version.service";
export declare class PublisherEngineProfilerService {
    private readonly version;
    constructor(version: PublisherVersionService);
    profile(): {
        engine: {
            engine: string;
            version: string;
            stage: string;
            build: string;
            timestamp: Date;
        };
        memory: NodeJS.MemoryUsage;
        uptime: number;
        pid: number;
        generatedAt: Date;
    };
}
