import { PublisherJobWriterService } from "./publisher-job-writer.service";
import { PublisherResult } from "../contracts/publisher.types";
export declare class PublisherSuccessService {
    private readonly writer;
    constructor(writer: PublisherJobWriterService);
    complete(job: any, result: PublisherResult, executionMs: number): Promise<any>;
}
