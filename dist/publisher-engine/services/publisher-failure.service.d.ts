import { PublisherJobWriterService } from "./publisher-job-writer.service";
export declare class PublisherFailureService {
    private readonly writer;
    constructor(writer: PublisherJobWriterService);
    fail(job: any, error: any): Promise<any>;
}
