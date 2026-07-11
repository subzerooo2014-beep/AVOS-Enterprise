import { PublisherJobFilterService } from "./publisher-job-filter.service";
import { PublisherJobGroupService } from "./publisher-job-group.service";
export declare class PublisherJobSummaryService {
    private readonly filter;
    private readonly group;
    constructor(filter: PublisherJobFilterService, group: PublisherJobGroupService);
    summary(jobs: any[]): {
        total: number;
        queued: number;
        processing: number;
        published: number;
        failed: number;
        channels: Record<string, any[]>;
        generatedAt: Date;
    };
}
