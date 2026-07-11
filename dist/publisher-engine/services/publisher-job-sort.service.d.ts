import { PublisherJobPriorityService } from "./publisher-job-priority.service";
export declare class PublisherJobSortService {
    private readonly priority;
    constructor(priority: PublisherJobPriorityService);
    sort(jobs: any[]): any[];
}
