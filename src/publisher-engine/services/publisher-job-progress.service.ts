import { Injectable } from "@nestjs/common";

@Injectable()
export class PublisherJobProgressService {
  progress(job: any) {
    switch (job.status) {
      case "queued":
        return 10;
      case "processing":
        return 60;
      case "published":
        return 100;
      case "failed":
      case "dead":
        return 0;
      default:
        return 0;
    }
  }
}
