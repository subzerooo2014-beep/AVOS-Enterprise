import { PublisherJobDeduplicationService } from "./publisher-job-deduplication.service";
import { PublisherJobFingerprintService } from "./publisher-job-fingerprint.service";
export declare class PublisherDedupEngineService {
    private readonly dedup;
    private readonly fingerprint;
    constructor(dedup: PublisherJobDeduplicationService, fingerprint: PublisherJobFingerprintService);
    check(job: any): {
        duplicate: boolean;
        key: string;
    };
}
