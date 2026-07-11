import { PublisherJobAgeService } from "./publisher-job-age.service";
export declare class PublisherJobExpirationService {
    private readonly age;
    constructor(age: PublisherJobAgeService);
    expired(job: any, hours?: number): boolean;
}
