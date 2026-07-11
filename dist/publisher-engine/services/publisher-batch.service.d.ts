import { PublisherJobWriterService } from "./publisher-job-writer.service";
export declare class PublisherBatchService {
    private readonly writer;
    constructor(writer: PublisherJobWriterService);
    enqueueMany(items: any[]): Promise<{
        success: boolean;
        created: number;
        jobs: any[];
    }>;
}
