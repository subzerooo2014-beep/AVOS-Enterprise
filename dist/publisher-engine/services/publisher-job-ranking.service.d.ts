import { PublisherJobPriorityService } from "./publisher-job-priority.service";
export declare class PublisherJobRankingService {
    private readonly priority;
    constructor(priority: PublisherJobPriorityService);
    rank(jobs: any[]): {
        job: any;
        score: number;
    }[];
}
