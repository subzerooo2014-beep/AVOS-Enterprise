import { PublisherJobWriterService } from "./publisher-job-writer.service";
export declare class PublisherLockService {
    private readonly writer;
    constructor(writer: PublisherJobWriterService);
    lock(job: any): Promise<any>;
    release(id: string): Promise<any>;
}
