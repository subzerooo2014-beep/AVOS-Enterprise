import { PublisherJobWindowService } from "./publisher-job-window.service";
export declare class PublisherQueueWindowService {
    private readonly window;
    constructor(window: PublisherJobWindowService);
    filter(jobs: any[]): any[];
}
