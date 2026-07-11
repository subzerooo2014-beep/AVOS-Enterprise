import { Injectable } from "@nestjs/common";
import { PublisherJobDeduplicationService } from "./publisher-job-deduplication.service";
import { PublisherJobFingerprintService } from "./publisher-job-fingerprint.service";

@Injectable()
export class PublisherDedupEngineService {
  constructor(
    private readonly dedup: PublisherJobDeduplicationService,
    private readonly fingerprint: PublisherJobFingerprintService,
  ) {}

  check(job: any) {
    const key = this.fingerprint.make(job);

    if (this.dedup.exists(key)) {
      return {
        duplicate: true,
        key,
      };
    }

    this.dedup.register(key);

    return {
      duplicate: false,
      key,
    };
  }
}
